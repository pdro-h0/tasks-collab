import { Module } from '@nestjs/common';
import { RabbitMQController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [],
    controllers: [RabbitMQController],
    providers: [AppService],
})
export class AppModule {}
