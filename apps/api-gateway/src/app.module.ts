import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3333,
        },
      },
    ]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
