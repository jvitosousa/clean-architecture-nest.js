import { ILogger } from '../../domain/logger/logger.interface';
import { DespesasModel } from '../../domain/model/despesas.model';
import { DespesaRepository } from '../../domain/repository/despesas.repository.interface';
export class UpdateDespesaUsecase {
  constructor(
    private readonly despesaRepository: DespesaRepository,
    private readonly iLogger: ILogger,
  ) {}

  async execute(
    valor: number,
    descricao: string,
    id: number,
    userId: number,
  ): Promise<void> {
    const despesa = new DespesasModel();
    despesa.id = id;
    despesa.valor = valor;
    despesa.descricao = descricao;
    await this.despesaRepository.updateContent(despesa, userId);
    this.iLogger.log('Despesa updated', '');
  }
}
