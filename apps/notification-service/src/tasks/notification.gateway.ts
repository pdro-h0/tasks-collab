import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'notifications',
})
export class NotificationGateway {
    @WebSocketServer()
    server: Server;
    private readonly logger = new Logger(NotificationGateway.name);
    async handleTaskCreatedNotification(payload: any) {
        this.logger.log('Sending task:created notification', payload);
        this.server.emit('task:created', {
            event: 'task:created',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }

    async handleTaskUpdatedNotification(payload: any) {
        this.logger.log('Sending task:updated notification', payload);
        this.server.emit('task:updated', {
            event: 'task:updated',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }

    async handleNewCommentTaskNotification(payload: any) {
        this.logger.log('Sending comment:new notification', payload);
        this.server.emit('comment:new', {
            event: 'comment:new',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
}
