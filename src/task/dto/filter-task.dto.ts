import { IsOptional, IsString } from 'class-validator';
import { Status } from '../entity/task.entity';

export class FilterTaskDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  status?: Status;
}
