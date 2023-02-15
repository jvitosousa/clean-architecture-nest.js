import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../../domain/model/user.model';
import * as moment from 'moment';

export class UserPresenter {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdate: string;

  constructor(model: UserModel) {
    this.name = model.name;
    this.email = model.email;
    this.createdate = moment(model.createdDate).format('YYYY-MM-DD HH:mm');
  }
}
