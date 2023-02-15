import { DespesasModel } from '../model/despesas.model';
import { UserModel } from '../model/user.model';

export interface DespesaRepository {
  insert(user: DespesasModel): Promise<DespesasModel>;
  findAll(userId: number): Promise<DespesasModel[]>;
  findByDescricao(descricao: string, userId: number): Promise<DespesasModel>;
  updateContent(despesa: DespesasModel, userId: number): Promise<void>;
  deleteByDescricao(descricao: string, userId: number): Promise<void>;
  getUserDespesa(despesaId: number): Promise<UserModel>;
}
