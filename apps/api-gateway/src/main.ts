import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreExceptionFilter } from './exceptions/core-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CoreExceptionFilter());
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
