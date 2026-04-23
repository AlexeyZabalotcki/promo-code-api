/**
 * API representation of a single promo activation.
 */
export interface ActivationView {
  readonly id: string;
  readonly promoCode: string;
  readonly promoCodeId: string;
  readonly email: string;
  readonly activatedAt: string;
}
