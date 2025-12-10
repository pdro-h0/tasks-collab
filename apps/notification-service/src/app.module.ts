import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQController } from './rabbitmq/rabbitmq.controller';
import { NotificationGateway } from './tasks/notification.gateway';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'API_GATEWAY',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://admin:admin@localhost:5672'],
                    queue: 'api_gateway_queue',
                },
            },
        ]),
    ],
    controllers: [RabbitMQController, NotificationController],
    providers: [AppService, NotificationGateway],
})
export class AppModule {}
