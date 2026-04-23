import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

/**
 * Registers a single Prisma client for the whole application.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
