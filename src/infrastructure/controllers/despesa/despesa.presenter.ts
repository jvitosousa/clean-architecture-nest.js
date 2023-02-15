import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { DespesasModel } from 'src/domain/model/despesas.model';

export class DespesaPresenter {
  @ApiProperty()
  valor: number;
  @ApiProperty()
  data: string;
  @ApiProperty()
  descricao: string;
  @ApiProperty()
  createdate: string;

  constructor(model: DespesasModel) {
    this.valor = model.valor;
    this.data = moment(model.data).format('YYYY-MM-DD HH:mm');
    this.descricao = model.descricao;
    this.createdate = moment(model.createdDate).format('YYYY-MM-DD HH:mm');
  }
}
