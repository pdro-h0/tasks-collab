import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokenHandler } from '@tasks-collab/core';
import { Comment } from 'src/db/entities/comment.entity';
import { TaskHistory } from 'src/db/entities/task-history.entity';
import { Task } from 'src/db/entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Comment, TaskHistory, Task]),
        ClientsModule.register([
            {
                name: 'TASKS_QUEUE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://admin:admin@localhost:5672'],
                    queue: 'tasks_queue',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [TasksController],
    providers: [
        TasksRepository,
        {
            provide: JwtTokenHandler,
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                if (!secret) {
                    throw new Error(
                        'JWT_SECRET is not defined in environment variables',
                    );
                }
                return new JwtTokenHandler(secret);
            },
            inject: [ConfigService],
        },
    ],
})
export class TasksModule {}
