import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base for domain-specific HTTP errors with a stable `errorCode` for clients and logs.
 */
export abstract class DomainException extends HttpException {
  protected constructor(
    message: string,
    public readonly errorCode: string,
    public readonly bodyStatus: HttpStatus,
  ) {
    super(
      {
        statusCode: bodyStatus,
        error: HttpStatus[bodyStatus] ?? 'Error',
        message,
        errorCode,
      } as Record<string, string | number | undefined>,
      bodyStatus,
    );
  }
}
