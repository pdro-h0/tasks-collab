/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Inject } from '@nestjs/common';
import {
    ClientProxy,
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException,
} from '@nestjs/microservices';
import {
    CommentTaskUseCase,
    CreateTaskUseCase,
    DeleteTaskUseCase,
    UpdateTaskUseCase,
} from '@tasks-collab/core';
import { CommentTaskDto, DeleteTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksRepository } from './tasks.repository';

@Controller()
export class TasksController {
    constructor(
        private readonly tasksRepo: TasksRepository,
        @Inject('NOTIFICATIONS_QUEUE') private readonly client: ClientProxy,
    ) {}

    @MessagePattern('task:created')
    async create(@Payload() payload, @Ctx() context: RmqContext) {
        const useCase = new CreateTaskUseCase(this.tasksRepo);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            await useCase.execute({
                ...payload.body,
                authorId: payload.userId,
            });
            this.client.emit('task:created', payload);
            channel.ack(originalMsg);
            return { success: true };
        } catch (error) {
            channel.nack(originalMsg, false, false);
            throw new RpcException(error);
        }
    }

    @MessagePattern('task:updated')
    async update(
        @Payload() payload: UpdateTaskDto,
        @Ctx() context: RmqContext,
    ) {
        const useCase = new UpdateTaskUseCase(this.tasksRepo);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            await useCase.execute({
                id: payload.id,
                taskData: payload.taskData,
            });
            this.client.emit('task:updated', payload);
            channel.ack(originalMsg);
            return { success: true };
        } catch (error) {
            channel.nack(originalMsg, false, false);
            throw new RpcException(error);
        }
    }

    @MessagePattern('task:deleted')
    async remove(@Payload() { id }: DeleteTaskDto, @Ctx() context: RmqContext) {
        const useCase = new DeleteTaskUseCase(this.tasksRepo);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            await useCase.execute({
                id,
            });
            channel.ack(originalMsg);
            return { success: true };
        } catch (error) {
            channel.nack(originalMsg, false, false);
            throw new RpcException(error);
        }
    }

    @MessagePattern('comment:new')
    async comment(
        @Payload() payload: CommentTaskDto,
        @Ctx() context: RmqContext,
    ) {
        const useCase = new CommentTaskUseCase(this.tasksRepo);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            await useCase.execute({
                ...payload.body,
                userId: payload.userId,
                taskId: payload.taskId,
            });
            this.client.emit('comment:new', payload);
            channel.ack(originalMsg);
            return { success: true };
        } catch (error) {
            channel.nack(originalMsg, false, false);
            throw new RpcException(error);
        }
    }
}
