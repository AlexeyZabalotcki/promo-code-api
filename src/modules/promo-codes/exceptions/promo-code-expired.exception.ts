import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@common/exceptions/domain.exception';

/**
 * Thrown when a promo is past its expiration.
 */
export class PromoCodeExpiredException extends DomainException {
  constructor(code: string) {
    super(`Promo code "${code}" is expired`, 'PROMO_EXPIRED', HttpStatus.GONE);
  }
}
