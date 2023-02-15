import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiExtraModels,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../../../infrastructure/common/guard/jwt.guard';
import { UseCaseProxy } from '../../../infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../../infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateDespesaUseCases } from '../../../usecases/despesas/createDespesa.usecase';
import { DeleteDespesaUsecase } from '../../../usecases/despesas/deleteDespesa.usecase';
import { GetDespesaUseCase } from '../../../usecases/despesas/getDespesa.usecase';
import { GetDespesasUseCase } from '../../../usecases/despesas/getDespesas.usecase';
import { UpdateDespesaUsecase } from '../../../usecases/despesas/updateDespesa.usecase';
import { DespesaDto } from './despesa.dto';
import { DespesaPresenter } from './despesa.presenter';
import { UpdateDespesaDto } from './despesaUpdate.dto';

@Controller('despesa')
@ApiTags('despesa')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels()
export class DespesaController {
  constructor(
    @Inject(UsecasesProxyModule.POST_DESPESA_USECASES_PROXY)
    private readonly postDespesaUseCasesProxy: UseCaseProxy<CreateDespesaUseCases>,
    @Inject(UsecasesProxyModule.UPDATE_DESPESA_USECASES_PROXY)
    private readonly updateDespesaUseCasesProxy: UseCaseProxy<UpdateDespesaUsecase>,
    @Inject(UsecasesProxyModule.DELETE_DESPESA_USECASES_PROXY)
    private readonly deleteDespesaUseCasesProxy: UseCaseProxy<DeleteDespesaUsecase>,
    @Inject(UsecasesProxyModule.GET_DESPESA_USECASES_PROXY)
    private readonly getDespesaUseCasesProxy: UseCaseProxy<GetDespesaUseCase>,
    @Inject(UsecasesProxyModule.GET_DESPESAS_USECASES_PROXY)
    private readonly getDespesasUseCasesProxy: UseCaseProxy<GetDespesasUseCase>,
  ) {}

  @ApiBody({ type: DespesaDto })
  @UseGuards(JwtGuard)
  @Post()
  @ApiOkResponse({ type: DespesaPresenter })
  async createDespesa(@Body() body: DespesaDto, @Req() req) {
    const result = await this.postDespesaUseCasesProxy
      .getInstance()
      .execute(
        body.valor,
        new Date(body.data),
        body.descricao,
        req.user.id,
        req.user.email,
      );
    return new DespesaPresenter(result);
  }

  @ApiBody({ type: UpdateDespesaDto })
  @UseGuards(JwtGuard)
  @Put()
  @ApiOkResponse({ type: DespesaPresenter })
  async updateDespesa(@Body() body: UpdateDespesaDto, @Req() req) {
    await this.updateDespesaUseCasesProxy
      .getInstance()
      .execute(body.valor, body.descricao, body.id, req.user.id);
    return { message: 'Despesa updated with success' };
  }

  @UseGuards(JwtGuard)
  @Delete()
  async deleteDespesa(@Query('descricao') descricao: string, @Req() req) {
    await this.deleteDespesaUseCasesProxy
      .getInstance()
      .execute(descricao, req.user.id);
    return { message: 'Despesa deleted with success' };
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiOkResponse({ type: DespesaPresenter })
  async getDespesa(@Query('descricao') descricao: string, @Req() req) {
    const despesa = await this.getDespesaUseCasesProxy
      .getInstance()
      .execute(descricao, req.user.id);
    return new DespesaPresenter(despesa);
  }

  @UseGuards(JwtGuard)
  @Get('all')
  @ApiOkResponse({ type: [DespesaPresenter] })
  async getAllDespesa(@Req() req) {
    const despesa = await this.getDespesasUseCasesProxy
      .getInstance()
      .execute(req.user.id);
    return despesa.map((despesa) => new DespesaPresenter(despesa));
  }
}
