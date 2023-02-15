import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../entity/task.entity';

export class TaskCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
