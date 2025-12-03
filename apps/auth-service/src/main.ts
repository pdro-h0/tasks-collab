import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { CoreExceptionFilter } from './exceptions/core-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalFilters(new CoreExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
