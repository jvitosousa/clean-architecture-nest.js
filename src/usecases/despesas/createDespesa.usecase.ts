import { InterfaceAws } from '../../domain/adapters/aws.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { DespesasModel } from '../../domain/model/despesas.model';
import { DespesaRepository } from '../../domain/repository/despesas.repository.interface';
export class CreateDespesaUseCases {
  constructor(
    private readonly despesaRepository: DespesaRepository,
    private readonly iLogger: ILogger,
    private readonly iAws: InterfaceAws,
  ) {}

  async execute(
    valor: number,
    data: Date,
    descricao: string,
    userId: number,
    email: string,
  ): Promise<DespesasModel> {
    const despesa = new DespesasModel();
    despesa.valor = valor;
    despesa.data = data;
    despesa.descricao = descricao;
    despesa.userId = userId;
    const result = this.despesaRepository.insert(despesa);
    this.iLogger.log('Despesa created', '');
    this.iAws.sendEmail(email, 'despesa cadastrada', 'Despesa created');
    return result;
  }
}
