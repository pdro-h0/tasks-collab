import { Module } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskHistory } from 'src/db/entities/task-history.entity';
import { Task } from 'src/db/entities/task.entity';
import { Comment } from 'src/db/entities/comment.entity';
import { JwtTokenHandler } from '@tasks-collab/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Comment, TaskHistory, Task]),
  ],
  controllers: [TasksController],
  providers: [
    TasksRepository,
    {
      provide: JwtTokenHandler,
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return new JwtTokenHandler(secret);
      },
      inject: [ConfigService],
    },
  ],
})
export class TasksModule {}
