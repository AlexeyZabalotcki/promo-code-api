import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PromoCodeParamPipe } from '@common/pipes/promo-code-param.pipe';
import { PaginatedResponse } from '@common/types/paginated.interface';
import { ActivatePromoCodeDto } from '@modules/promo-codes/dto/activate-promo-code.dto';
import { CreatePromoCodeDto } from '@modules/promo-codes/dto/create-promo-code.dto';
import { ListPromoCodesQueryDto } from '@modules/promo-codes/dto/list-promo-codes.query.dto';
import { PromoCodeActivationService } from '@modules/promo-codes/promo-code-activation.service';
import { PromoCodesService } from '@modules/promo-codes/promo-codes.service';
import { ActivationView } from '@modules/promo-codes/responses/activation.view';
import { PromoCodeView } from '@modules/promo-codes/responses/promo-code.view';

/**
 * HTTP surface for promos; orchestration-only (delegates to services).
 */
@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(
    private readonly promoCodes: PromoCodesService,
    private readonly activations: PromoCodeActivationService,
  ) {}
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a promo' })
  @ApiBody({ type: CreatePromoCodeDto })
  @ApiOkResponse({ type: Object })
  create(@Body() body: CreatePromoCodeDto): Promise<PromoCodeView> {
    return this.promoCodes.create(body);
  }
  @Get()
  @ApiOperation({ summary: 'List promos' })
  list(@Query() query: ListPromoCodesQueryDto): Promise<PaginatedResponse<PromoCodeView>> {
    return this.promoCodes.list(query);
  }
  @Post(':code/activate')
  @HttpCode(201)
  @ApiOperation({ summary: 'Activate a promo for an email' })
  @ApiParam({ name: 'code' })
  @ApiBody({ type: ActivatePromoCodeDto })
  @ApiOkResponse({ type: Object })
  activate(
    @Param('code', PromoCodeParamPipe) code: string,
    @Body() body: ActivatePromoCodeDto,
  ): Promise<ActivationView> {
    return this.activations.activate(code, body.email);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get promo by id' })
  getById(@Param('id', new ParseUUIDPipe({ version: '7' })) id: string): Promise<PromoCodeView> {
    return this.promoCodes.findById(id);
  }
}
