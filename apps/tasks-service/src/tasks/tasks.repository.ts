import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CommentTask,
    CreateTask,
    DeleteTask,
    GetTask,
    UpdateTask,
} from '@tasks-collab/core/types';
import { Comment } from 'src/db/entities/comment.entity';
import { Task } from 'src/db/entities/task.entity';
import { Repository } from 'typeorm';
import {
    CreateTaskDto,
    DeleteTaskDto,
    GetTaskByIdDto,
    UpdateTaskDto,
} from './dto/task.dto';

@Injectable()
export class TasksRepository
    implements GetTask, CreateTask, DeleteTask, UpdateTask, CommentTask
{
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
    ) {}
    async comment(input: {
        content: string;
        userId: string;
        taskId: string;
    }): Promise<void> {
        await this.commentRepo.save(input);
    }
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
