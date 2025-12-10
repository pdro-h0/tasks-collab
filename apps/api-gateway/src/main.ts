import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CoreExceptionFilter } from './exceptions/core-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'api_gateway_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CoreExceptionFilter());
  app.use(cookieParser());
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
