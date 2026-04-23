import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7+ CLI entry; loads DATABASE_URL from environment.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
