import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';
import { TaskCreateDto } from './dto/task-create.dto';
import { DeleteResult } from 'typeorm';
import { FilterTaskDto } from './dto/filter-task.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/filter')
  @UseGuards(AuthGuard())
  async getTaskByFilter(
    @Query() filterTaskDto: FilterTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return await this.taskService.getTaskFilter(filterTaskDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getTaskList(@GetUser() user: User): Promise<Task[]> {
    return await this.taskService.getTaskList(user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async getTaskById(@Param('id') taskId: string, @GetUser() user: User) {
    return await this.taskService.getTaskById(taskId, user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createTask(
    @Body() createTaskDto: TaskCreateDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteTask(
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<DeleteResult> {
    return await this.taskService.deleteTask(taskId, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  async updateTask(
    @Param('id') taskId: string,
    @Query()
    status: UpdateStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(taskId, status, user);
  }
}
