import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from '@common/config/app-config.service';
import { envValidation } from '@common/config/env.validation';
import { PrismaModule } from '@common/prisma/prisma.module';
import { PromoCodesModule } from '@modules/promo-codes/promo-codes.module';

/**
 * Application root: configuration, Prisma, and feature modules.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidation,
    }),
    PrismaModule,
    PromoCodesModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
