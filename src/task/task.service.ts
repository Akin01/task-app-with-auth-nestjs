import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TaskCreateDto } from './dto/task-create.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { User } from '../auth/entity/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getTaskList(user: User): Promise<Task[]> {
    return await this.taskRepository.find({
      loadRelationIds: true,
      where: {
        user,
      },
    });
  }

  async getTaskById(taskId: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      taskId,
      user,
    });

    if (!task) {
      throw new NotFoundException("task doesn't exist");
    }

    return task;
  }

  async getTaskFilter(
    filterTaskDto: FilterTaskDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('t');
    const { status, search } = filterTaskDto;

    console.log(search);

    if (search) {
      query.andWhere('t.title ILIKE :search OR t.description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (status) {
      query.andWhere('t.status ILIKE :status', {
        status: `%${status}%`,
      });
    }

    query.andWhere('t.user_id = :user', {
      user: user.userId,
    });

    return query.getMany();
  }

  async createTask(task: TaskCreateDto, user: User): Promise<Task> {
    const taskSaved = this.taskRepository.create({
      ...task,
      user,
    });
    await this.taskRepository.save(taskSaved);
    return taskSaved;
  }

  async deleteTask(id: string, user: User): Promise<DeleteResult> {
    const taskDeleted = await this.taskRepository.delete({
      taskId: id,
      user,
    });

    if (!taskDeleted) {
      throw new NotFoundException("task doesn't exist");
    }

    return taskDeleted;
  }

  async updateTaskStatus(
    id: string,
    status: UpdateStatusDto,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      taskId: id,
      user,
    });

    if (!task) {
      throw new NotFoundException("task doesn't exist");
    }

    task.status = status.status;
    await this.taskRepository.save(task);

    return task;
  }
}
