import { ILogger } from '../../domain/logger/logger.interface';
import { DespesasModel } from '../../domain/model/despesas.model';
import { DespesaRepository } from '../../domain/repository/despesas.repository.interface';

export class GetDespesasUseCase {
  constructor(
    private readonly despesaRepository: DespesaRepository,
    private readonly iLogger: ILogger,
  ) {}

  async execute(userId: number): Promise<DespesasModel[]> {
    const despesas = await this.despesaRepository.findAll(userId);
    this.iLogger.log('Get Despesas', 'Despesas found with success');
    return despesas;
  }
}
