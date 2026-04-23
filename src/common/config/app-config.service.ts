import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Strongly-typed read access to validated environment.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}
  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }
  get port(): number {
    return parseInt(this.config.get<string>('PORT', '3000'), 10);
  }
  get databaseUrl(): string {
    return this.config.getOrThrow<string>('DATABASE_URL');
  }
  get logLevel(): string {
    return this.config.get<string>('LOG_LEVEL', 'log');
  }
}
