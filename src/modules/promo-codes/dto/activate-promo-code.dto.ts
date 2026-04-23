import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';

/**
 * Body for activation by email.
 */
export class ActivatePromoCodeDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(320)
  @Transform(({ value }: { value: string }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;
}
