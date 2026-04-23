import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { SERIALIZABLE_TX_MAX_ATTEMPTS } from '@modules/promo-codes/constants/activation-transaction.constants';
import { PromoCodeAlreadyActivatedException } from '@modules/promo-codes/exceptions/promo-code-already-activated.exception';
import { PromoCodeExpiredException } from '@modules/promo-codes/exceptions/promo-code-expired.exception';
import { PromoCodeLimitReachedException } from '@modules/promo-codes/exceptions/promo-code-limit-reached.exception';
import { PromoCodeNotFoundException } from '@modules/promo-codes/exceptions/promo-code-not-found.exception';
import { ActivationMapper } from '@modules/promo-codes/mappers/activation.mapper';
import { PromoCodeExpirationPolicy } from '@modules/promo-codes/policies/promo-code-expiration.policy';
import { ActivationView } from '@modules/promo-codes/responses/activation.view';
import { Prisma } from '@prisma-client';

/**
 * Serializable transaction + unique index to bind a code to an email once per code and respect limits.
 */
@Injectable()
export class PromoCodeActivationService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Activates a promo for the given email if all rules pass.
   */
  async activate(code: string, email: string): Promise<ActivationView> {
    for (let attempt = 0; attempt < SERIALIZABLE_TX_MAX_ATTEMPTS; attempt += 1) {
      try {
        const row = await this.prisma.$transaction(
          async (tx) => {
            const promo = await tx.promoCode.findUnique({ where: { code } });
            if (promo === null) {
              throw new PromoCodeNotFoundException(code);
            }
            const now = new Date();
            if (PromoCodeExpirationPolicy.isBeforeOrEqualToNow(promo.expiresAt, now)) {
              throw new PromoCodeExpiredException(code);
            }
            const used = await tx.activation.count({ where: { promoCodeId: promo.id } });
            if (used >= promo.activationLimit) {
              throw new PromoCodeLimitReachedException(code);
            }
            try {
              return await tx.activation.create({
                data: { promoCodeId: promo.id, email },
              });
            } catch (e) {
              if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new PromoCodeAlreadyActivatedException(code);
              }
              throw e;
            }
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );
        return ActivationMapper.toView(row, code);
      } catch (e) {
        const canRetry =
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2034' &&
          attempt < SERIALIZABLE_TX_MAX_ATTEMPTS - 1;
        if (canRetry) {
          continue;
        }
        throw e;
      }
    }
    throw new Error('Activation should have returned or thrown');
  }
}
