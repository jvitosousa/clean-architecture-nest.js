import { Injectable } from '@nestjs/common';
import { IBcryptService } from '../../../domain/adapters/bcrypt.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IBcryptService {
  async hash(hashString: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(hashString, salt);
  }
  async compare(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
