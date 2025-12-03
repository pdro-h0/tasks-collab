/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  InvalidToken,
  TokenExpired,
  UserNotFound,
  InvalidRefreshToken,
  TaskNotFound,
  InvalidCredentials,
  UserAlreadyRegistered,
} from '@tasks-collab/core';

export const exceptionStatusMap = {
  [InvalidToken.name]: HttpStatus.UNAUTHORIZED,
  [TokenExpired.name]: HttpStatus.UNAUTHORIZED,
  [UserNotFound.name]: HttpStatus.NOT_FOUND,
  [InvalidRefreshToken.name]: HttpStatus.UNAUTHORIZED,
  [TaskNotFound.name]: HttpStatus.NOT_FOUND,
  [InvalidCredentials.name]: HttpStatus.UNAUTHORIZED,
  [UserAlreadyRegistered.name]: HttpStatus.CONFLICT,
};

type ExceptionType = keyof typeof exceptionStatusMap;

@Catch(
  InvalidToken,
  TokenExpired,
  UserNotFound,
  InvalidRefreshToken,
  TaskNotFound,
  InvalidCredentials,
  UserAlreadyRegistered,
  HttpException,
)
export class CoreExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle HttpException (including those from NestJS)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Internal server error',
        error: exception.name,
      });
    }

    // Handle our custom exceptions
    const status =
      exceptionStatusMap[exception.name as ExceptionType] ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
