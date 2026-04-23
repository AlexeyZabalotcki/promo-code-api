import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@common/exceptions/domain.exception';

/**
 * Thrown when a promo code is missing.
 */
export class PromoCodeNotFoundException extends DomainException {
  constructor(code: string) {
    super(`Promo code "${code}" not found`, 'PROMO_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
