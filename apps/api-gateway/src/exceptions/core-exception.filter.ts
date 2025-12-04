import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { RpcException } from '@nestjs/microservices';

type ErrorPayload = {
  name?: string;
  message?: string;
  status?: number;
  statusCode?: number;
  error?: string;
};

@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, body } = this.getHttpResponseFromException(exception);

    response.status(statusCode).json({
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...body,
    });
  }

  private getHttpResponseFromException(exception: unknown): {
    statusCode: number;
    body: { message: string; error: string } & Record<string, unknown>;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const httpResponse = exception.getResponse();
      if (typeof httpResponse === 'string') {
        return {
          statusCode,
          body: {
            message: httpResponse,
            error: exception.name,
          },
        };
      }
      return {
        statusCode,
        body: {
          message:
            (httpResponse as Record<string, unknown>)?.[
              'message'
            ]?.toString() ?? exception.message,
          error:
            (httpResponse as Record<string, unknown>)?.['error']?.toString() ??
            exception.name,
          ...(typeof httpResponse === 'object' ? httpResponse : {}),
        },
      };
    }

    const error = this.unwrapException(exception);
    const statusCode = this.getStatusFromError(error);

    return {
      statusCode,
      body: {
        message: error.message ?? 'Internal server error',
        error: error.name ?? 'Error',
      },
    };
  }

  private unwrapException(exception: unknown): ErrorPayload {
    if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      if (rpcError instanceof Error) {
        return rpcError;
      }
      if (typeof rpcError === 'object' && rpcError !== null) {
        return rpcError as ErrorPayload;
      }
      return {
        name: 'RpcException',
        message: rpcError?.toString?.() ?? 'Microservice error',
      };
    }

    if (exception instanceof Error) {
      return exception;
    }

    if (typeof exception === 'object' && exception !== null) {
      return exception as ErrorPayload;
    }

    return {
      name: 'Error',
      message: exception?.toString?.() ?? 'Internal server error',
    };
  }

  private getStatusFromError(error: ErrorPayload): number {
    if (typeof error?.statusCode === 'number') {
      return error.statusCode;
    }
    if (typeof error?.status === 'number') {
      return error.status;
    }

    const statusByName: Record<string, number> = {
      InvalidCredentials: HttpStatus.UNAUTHORIZED,
      InvalidRefreshToken: HttpStatus.UNAUTHORIZED,
      InvalidToken: HttpStatus.UNAUTHORIZED,
      TokenExpired: HttpStatus.UNAUTHORIZED,
      UserNotFound: HttpStatus.NOT_FOUND,
      UserAlreadyRegistered: HttpStatus.CONFLICT,
      TaskNotFound: HttpStatus.NOT_FOUND,
    };

    if (error?.name && statusByName[error.name]) {
      return statusByName[error.name];
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
