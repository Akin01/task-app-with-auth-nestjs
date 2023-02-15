import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interface/jwt-payload.interface';
import { JwtResponseInterface } from './interface/jwt-response-interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getUserList(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        userId: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        task: true,
      },
      loadEagerRelations: true,
      relations: {
        task: true,
      },
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { password, ...data } = signUpDto;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('user already exist');
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async signIn(signInDto: SignInDto): Promise<JwtResponseInterface> {
    const user = await this.userRepository.findOneBy({
      username: signInDto.username,
    });

    if (!user) {
      throw new UnauthorizedException('your username is wrong');
    }

    const comparePassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('your password is wrong');
    }

    const payload: JwtPayloadInterface = {
      username: signInDto.username,
    };

    const accessToken: string = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
  }
}
