import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  emitTaskCreated() {
    this.server.emit('task:created', 'A new task was created');
  }

  emitTaskUpdated(payload: any) {
    this.server.emit(
      'task:updated',
      `Task - ${payload.taskData.title} was updated`,
    );
  }

  emitCommentTask(payload: any) {
    console.log(payload);
    this.server.emit(
      'comment:new',
      `Task - with id ${payload.taskId} has new comment`,
    );
  }
}
