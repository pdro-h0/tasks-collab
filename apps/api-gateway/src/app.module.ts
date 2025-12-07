import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './tasks/tasks.controller';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

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
        transport: Transport.TCP,
        options: {
          port: 3000,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController, UserController, TasksController],
  providers: [AppService],
})
export class AppModule {}
