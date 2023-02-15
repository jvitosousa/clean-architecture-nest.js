import { Injectable } from '@nestjs/common';
import {
  InterfaceJwtService,
  InterfaceJwtServicePayload,
} from '../../../domain/adapters/jwt.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService implements InterfaceJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }
  async createToken(payload: InterfaceJwtServicePayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
export { JwtService };
