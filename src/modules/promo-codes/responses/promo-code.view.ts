/**
 * API representation of a promo code (no Prisma model leakage).
 */
export interface PromoCodeView {
  readonly id: string;
  readonly code: string;
  readonly discountPercent: number;
  readonly activationLimit: number;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly redemptionsCount: number;
}
