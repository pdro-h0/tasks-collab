import { Injectable } from '@nestjs/common';
import {
    CreateTaskDto,
    DeleteTaskDto,
    GetTaskByIdDto,
    UpdateTaskDto,
} from './dto/task.dto';
import {
    GetTask,
    CreateTask,
    DeleteTask,
    UpdateTask,
} from '@tasks-collab/core/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/db/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksRepository
    implements GetTask, CreateTask, DeleteTask, UpdateTask
{
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
    ) {}
    async getById(input: GetTaskByIdDto): Promise<Task | null> {
        return await this.taskRepo.findOneBy({ id: input.id });
    }
    async create(input: CreateTaskDto): Promise<void> {
        await this.taskRepo.save(input);
    }
    async delete(input: DeleteTaskDto): Promise<void> {
        await this.taskRepo.delete({ id: input.id });
    }
    async update(input: UpdateTaskDto): Promise<void> {
        await this.taskRepo.update(input.id, input.taskData);
    }
}
