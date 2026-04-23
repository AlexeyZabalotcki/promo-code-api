import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const PROMO_CODE_PATTERN = /^[A-Z0-9_-]{3,32}$/;

/**
 * Normalizes path param to uppercase and validates format.
 */
@Injectable()
export class PromoCodeParamPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const normalized = value.trim().toUpperCase();
    if (!PROMO_CODE_PATTERN.test(normalized)) {
      throw new BadRequestException('Invalid promo code format');
    }
    return normalized;
  }
}
