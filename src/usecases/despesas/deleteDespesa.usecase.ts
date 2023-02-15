import { ILogger } from '../../domain/logger/logger.interface';
import { DespesaRepository } from '../../domain/repository/despesas.repository.interface';

export class DeleteDespesaUsecase {
  constructor(
    private readonly despesaRepository: DespesaRepository,
    private readonly iLogger: ILogger,
  ) {}
  async execute(descricao: string, userId: number): Promise<void> {
    await this.despesaRepository.deleteByDescricao(descricao, userId);
    this.iLogger.log('Delete despesa', 'success');
  }
}
