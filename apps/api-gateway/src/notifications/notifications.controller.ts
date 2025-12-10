import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class NotificationsController {
  constructor(private readonly gateway: NotificationsGateway) {}

  @MessagePattern('ws:task:created')
  handleWsTaskCreated(@Payload() payload: any) {
    this.gateway.emitTaskCreated();
  }

  @MessagePattern('ws:task:updated')
  handleWsTaskUpdated(@Payload() payload: any) {
    this.gateway.emitTaskUpdated(payload);
  }

  @MessagePattern('ws:comment:new')
  handleWsCommentTask(@Payload() payload: any) {
    this.gateway.emitCommentTask(payload);
  }
}
