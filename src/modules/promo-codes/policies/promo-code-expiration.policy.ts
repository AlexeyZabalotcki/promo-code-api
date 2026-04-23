import dayjs from 'dayjs';

/**
 * Encapsulates date rules for whether a campaign can still be redeemed.
 */
export class PromoCodeExpirationPolicy {
  static isStrictlyInFuture(expiresAt: Date, now: Date): boolean {
    return dayjs(expiresAt).isAfter(now);
  }
  static isBeforeOrEqualToNow(expiresAt: Date, now: Date): boolean {
    return !dayjs(expiresAt).isAfter(now);
  }
}
