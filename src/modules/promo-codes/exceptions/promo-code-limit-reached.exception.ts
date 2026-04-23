import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@common/exceptions/domain.exception';

/**
 * Thrown when activation would exceed the configured limit.
 */
export class PromoCodeLimitReachedException extends DomainException {
  constructor(code: string) {
    super(
      `Promo code "${code}" has no activations left`,
      'PROMO_LIMIT_REACHED',
      HttpStatus.CONFLICT,
    );
  }
}
