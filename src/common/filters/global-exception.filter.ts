import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

const MIN_SERVER_ERROR_HTTP = 500;

/**
 * Maps unhandled errors to a consistent JSON body; logs server-side errors only.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const payload =
        typeof res === 'string'
          ? { statusCode: status, error: HttpStatus[status], message: res }
          : (res as Record<string, string | number | string[] | undefined>);
      response.status(status).json(payload);
      if (Number(status) >= MIN_SERVER_ERROR_HTTP) {
        this.logger.error(exception.message, exception.stack);
      }
      return;
    }
    this.logger.error(exception.message, exception.stack);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
}
