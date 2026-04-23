import { Module } from '@nestjs/common';
import { PromoCodeParamPipe } from '@common/pipes/promo-code-param.pipe';
import { PromoCodeActivationService } from '@modules/promo-codes/promo-code-activation.service';
import { PromoCodesController } from '@modules/promo-codes/promo-codes.controller';
import { PromoCodesService } from '@modules/promo-codes/promo-codes.service';

/**
 * Encapsulates promo and activation use cases.
 */
@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService, PromoCodeActivationService, PromoCodeParamPipe],
  exports: [PromoCodesService, PromoCodeActivationService],
})
export class PromoCodesModule {}
