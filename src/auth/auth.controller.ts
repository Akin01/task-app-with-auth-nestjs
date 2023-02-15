import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entity/user.entity';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtResponseInterface } from './interface/jwt-response-interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<JwtResponseInterface> {
    return this.authService.signIn(signInDto);
  }

  @Get('/user')
  getUsers() {
    return this.authService.getUserList();
  }
}
