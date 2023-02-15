import { ILogger } from '../../domain/logger/logger.interface';
import { DespesasModel } from '../../domain/model/despesas.model';
import { DespesaRepository } from '../../domain/repository/despesas.repository.interface';

export class GetDespesaUseCase {
  constructor(
    private readonly despesaRepository: DespesaRepository,
    private readonly iLogger: ILogger,
  ) {}
  async execute(descricao: string, userId: number): Promise<DespesasModel> {
    const result = await this.despesaRepository.findByDescricao(
      descricao,
      userId,
    );
    this.iLogger.log('Get despesa by descricao', 'success');
    return result;
  }
}
