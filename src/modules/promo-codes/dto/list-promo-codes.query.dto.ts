import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Query parameters for listing promos.
 */
export class ListPromoCodesQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
  @ApiPropertyOptional({ default: DEFAULT_PAGE_SIZE, minimum: 1, maximum: MAX_PAGE_SIZE })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit: number = DEFAULT_PAGE_SIZE;
  @ApiPropertyOptional({
    description: 'When true, only promos with remaining capacity and a future end date; when false, only exhausted or past ones.',
  })
  @IsOptional()
  @Transform(
    (args: { value: string | boolean | undefined }): boolean | undefined => {
      const v = args.value;
      if (v === true || v === 'true') {
        return true;
      }
      if (v === false || v === 'false') {
        return false;
      }
      return undefined;
    },
  )
  @IsBoolean()
  isActive?: boolean;
}
