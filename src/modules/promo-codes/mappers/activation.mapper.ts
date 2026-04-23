import type { Activation } from '@prisma-client';
import { ActivationView } from '@modules/promo-codes/responses/activation.view';

/**
 * Maps activation row to a stable API type.
 */
export class ActivationMapper {
  static toView(row: Activation, promoCode: string): ActivationView {
    return {
      id: row.id,
      promoCode,
      promoCodeId: row.promoCodeId,
      email: row.email,
      activatedAt: row.activatedAt.toISOString(),
    };
  }
}
