/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Inject, Logger } from '@nestjs/common';
import {
    ClientProxy,
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { NotificationGateway } from './tasks/notification.gateway';

@Controller()
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(
        @Inject(NotificationGateway)
        private readonly notificationGateway: NotificationGateway,
        @Inject('API_GATEWAY')
        private readonly apiGatewayClient: ClientProxy,
    ) {}

    @MessagePattern('task:created')
    async handleTaskCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        try {
            this.logger.log(`processing task creatad: ${JSON.stringify(data)}`);
            this.notificationGateway.handleTaskCreatedNotification(data);
            channel.ack(context.getMessage());
            this.apiGatewayClient.emit('ws:task:created', data);
        } catch (error) {
            this.logger.error(
                `Error processing notification: ${error.message}`,
                error.stack,
            );
            channel.nack(context.getMessage(), false, false);
            throw error;
        }
    }

    @MessagePattern('task:updated')
    async taskUpdated(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        try {
            this.logger.log(
                `task updated notification: ${JSON.stringify(data)}`,
            );
            this.notificationGateway.handleTaskUpdatedNotification(data);
            channel.ack(context.getMessage());
            this.apiGatewayClient.emit('ws:task:updated', data);
        } catch (error) {
            this.logger.error(
                `Error processing notification: ${error.message}`,
                error.stack,
            );
            channel.nack(context.getMessage(), false, false);
            throw error;
        }
    }

    @MessagePattern('comment:new')
    async commentTask(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        try {
            this.logger.log(
                `new task comment notification: ${JSON.stringify(data)}`,
            );
            this.notificationGateway.handleNewCommentTaskNotification(data);
            channel.ack(context.getMessage());
            this.apiGatewayClient.emit('ws:comment:new', data);
        } catch (error) {
            this.logger.error(
                `Error processing notification: ${error.message}`,
                error.stack,
            );
            channel.nack(context.getMessage(), false, false);
            throw error;
        }
    }
}
