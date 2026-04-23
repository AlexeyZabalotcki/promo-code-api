import { PromoCodeView } from '@modules/promo-codes/responses/promo-code.view';
import { Prisma } from '@prisma-client';

type PromoWithCount = Prisma.PromoCodeGetPayload<{
  include: { _count: { select: { activations: true } } };
}>;

/**
 * Maps persistence payload to a stable API type.
 */
export class PromoCodeMapper {
  static toView(row: PromoWithCount): PromoCodeView {
    return {
      id: row.id,
      code: row.code,
      discountPercent: row.discountPercent,
      activationLimit: row.activationLimit,
      expiresAt: row.expiresAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      redemptionsCount: row._count.activations,
    };
  }
}
