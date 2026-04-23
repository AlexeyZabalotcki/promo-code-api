import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@common/exceptions/domain.exception';

/**
 * Thrown when the email already used this code.
 */
export class PromoCodeAlreadyActivatedException extends DomainException {
  constructor(code: string) {
    super(
      `Email already activated promo code "${code}"`,
      'PROMO_ALREADY_ACTIVATED',
      HttpStatus.CONFLICT,
    );
  }
}
