import { Controller } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto, DeleteTaskDto, UpdateTaskDto } from './dto/task.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
} from '@tasks-collab/core';

@Controller()
export class TasksController {
    constructor(private readonly tasksRepo: TasksRepository) {}

    @MessagePattern({ cmd: 'task-created' })
    async create(@Payload() payload: { body: CreateTaskDto; userId: string }) {
        const useCase = new CreateTaskUseCase(this.tasksRepo);
        try {
            await useCase.execute({
                ...payload.body,
                authorId: payload.userId,
            });
            return { success: true };
        } catch (error) {
            throw new RpcException(error);
        }
    }

    @MessagePattern({ cmd: 'task-updated' })
    async update(@Payload() payload: UpdateTaskDto) {
        const useCase = new UpdateTaskUseCase(this.tasksRepo);
        try {
            await useCase.execute({
                id: payload.id,
                taskData: payload.taskData,
            });
            return { success: true };
        } catch (error) {
            console.log(payload);
            throw new RpcException(error);
        }
    }

    @MessagePattern({ cmd: 'task-deleted' })
    async remove(@Payload() { id }: DeleteTaskDto) {
        const useCase = new DeleteTaskUseCase(this.tasksRepo);
        try {
            await useCase.execute({
                id,
            });
            return { success: true };
        } catch (error) {
            throw new RpcException(error);
        }
    }
}
