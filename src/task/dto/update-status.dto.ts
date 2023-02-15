import { Status } from '../entity/task.entity';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(Status)
  status: Status;
}
