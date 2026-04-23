import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

const PROMO_CODE_RE = /^[A-Z0-9_-]{3,32}$/;

/**
 * Input for creating a promo.
 */
export class CreatePromoCodeDto {
  @ApiProperty({ example: 'SUMMER-25' })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(PROMO_CODE_RE)
  @Transform(({ value }: { value: string }): string => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  code!: string;
  @ApiProperty({ example: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  discountPercent!: number;
  @ApiProperty({ example: 100, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  activationLimit!: number;
  @ApiProperty({ type: String, example: '2026-12-31T23:59:59.000Z' })
  @Type(() => Date)
  @IsDate()
  expiresAt!: Date;
}
