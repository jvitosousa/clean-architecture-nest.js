import { UserModel } from './user.model';

export class DespesasModel {
  id: number;
  valor: number;
  data: Date;
  descricao: string;
  userId: UserModel['id'];
  createdDate: Date;
  updatedDate: Date;
}
