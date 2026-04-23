import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from '@common/types/paginated.interface';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreatePromoCodeDto } from '@modules/promo-codes/dto/create-promo-code.dto';
import { ListPromoCodesQueryDto } from '@modules/promo-codes/dto/list-promo-codes.query.dto';
import { PromoCodeMapper } from '@modules/promo-codes/mappers/promo-code.mapper';
import { PromoCodeExpirationPolicy } from '@modules/promo-codes/policies/promo-code-expiration.policy';
import { PromoCodeView } from '@modules/promo-codes/responses/promo-code.view';
import { Prisma } from '@prisma-client';

/**
 * Creates and queries promo codes (read side for list/detail).
 */
@Injectable()
export class PromoCodesService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Persists a new promo after validating business rules.
   */
  async create(dto: CreatePromoCodeDto): Promise<PromoCodeView> {
    const now = new Date();
    if (!PromoCodeExpirationPolicy.isStrictlyInFuture(dto.expiresAt, now)) {
      throw new BadRequestException('expiresAt must be in the future');
    }
    try {
      const row = await this.prisma.promoCode.create({
        data: {
          code: dto.code,
          discountPercent: dto.discountPercent,
          activationLimit: dto.activationLimit,
          expiresAt: dto.expiresAt,
        },
        include: { _count: { select: { activations: true } } },
      });
      return PromoCodeMapper.toView(row);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Promo code already exists');
      }
      throw e;
    }
  }
  /**
   * Returns one promo by primary key.
   */
  async findById(id: string): Promise<PromoCodeView> {
    const row = await this.prisma.promoCode.findUnique({
      where: { id },
      include: { _count: { select: { activations: true } } },
    });
    if (row === null) {
      throw new NotFoundException('Promo code not found');
    }
    return PromoCodeMapper.toView(row);
  }
  /**
   * Lists promos with optional "active" predicate and stable ordering.
   */
  async list(query: ListPromoCodesQueryDto): Promise<PaginatedResponse<PromoCodeView>> {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const now = new Date();
    if (query.isActive === undefined) {
      const [rows, total] = await this.prisma.$transaction([
        this.prisma.promoCode.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: { _count: { select: { activations: true } } },
        }),
        this.prisma.promoCode.count(),
      ]);
      return {
        items: rows.map((r) => PromoCodeMapper.toView(r)),
        total,
        page,
        limit,
      };
    }
    if (query.isActive === true) {
      const [countRows, idRows] = await this.prisma.$transaction([
        this.prisma.$queryRaw<[{ c: bigint }]>(Prisma.sql`
          SELECT COUNT(*)::bigint AS c
          FROM promo_codes p
          WHERE p.expires_at > ${now}
            AND (
              SELECT COUNT(*)::int
              FROM activations a
              WHERE a.promo_code_id = p.id
            ) < p.activation_limit
        `),
        this.prisma.$queryRaw<[{ id: string }]>(Prisma.sql`
          SELECT p.id
          FROM promo_codes p
          WHERE p.expires_at > ${now}
            AND (
              SELECT COUNT(*)::int
              FROM activations a
              WHERE a.promo_code_id = p.id
            ) < p.activation_limit
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${skip}
        `),
      ]);
      const total = Number(countRows[0]?.c ?? 0n);
      const ids = idRows.map((r) => r.id);
      if (ids.length === 0) {
        return { items: [], total, page, limit };
      }
      const rows = await this.prisma.promoCode.findMany({
        where: { id: { in: ids } },
        include: { _count: { select: { activations: true } } },
      });
      const order = new Map<string, number>(ids.map((id, i) => [id, i]));
      rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
      return {
        items: rows.map((r) => PromoCodeMapper.toView(r)),
        total,
        page,
        limit,
      };
    }
    const [countRows, idRows] = await this.prisma.$transaction([
      this.prisma.$queryRaw<[{ c: bigint }]>(Prisma.sql`
        SELECT COUNT(*)::bigint AS c
        FROM promo_codes p
        WHERE p.expires_at <= ${now}
           OR (
             SELECT COUNT(*)::int
             FROM activations a
             WHERE a.promo_code_id = p.id
           ) >= p.activation_limit
      `),
      this.prisma.$queryRaw<[{ id: string }]>(Prisma.sql`
        SELECT p.id
        FROM promo_codes p
        WHERE p.expires_at <= ${now}
           OR (
             SELECT COUNT(*)::int
             FROM activations a
             WHERE a.promo_code_id = p.id
           ) >= p.activation_limit
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${skip}
      `),
    ]);
    const total = Number(countRows[0]?.c ?? 0n);
    const ids = idRows.map((r) => r.id);
    if (ids.length === 0) {
      return { items: [], total, page, limit };
    }
    const rows = await this.prisma.promoCode.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { activations: true } } },
    });
    const order = new Map<string, number>(ids.map((id, i) => [id, i]));
    rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    return {
      items: rows.map((r) => PromoCodeMapper.toView(r)),
      total,
      page,
      limit,
    };
  }
}
