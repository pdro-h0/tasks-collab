import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { UserController } from './user/user.controller';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3333,
        },
      },

      {
        name: 'TASKS-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'tasks_queue',
          noAck: true,
          persistent: true,
          queueOptions: {
            durable: true,
          },
        },
      },

      {
        name: 'NOTIFICATIONS-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'notifications_queue',
          noAck: false,
          persistent: true,
          prefetchCount: 1,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [
    AppController,
    UserController,
    TasksController,
    NotificationsController,
  ],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}
