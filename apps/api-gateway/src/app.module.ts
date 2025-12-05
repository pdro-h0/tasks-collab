import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './tasks/tasks.controller';
import { JwtTokenHandler } from '@tasks-collab/core';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
        transport: Transport.TCP,
        options: {
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [AppController, UserController, TasksController],
  providers: [
    AppService,
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
export class AppModule {}
