import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import {
  InterfaceJwtService,
  InterfaceJwtServicePayload,
} from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserModel } from '../../domain/model/user.model';
import { UserRepository } from '../../domain/repository/user.repository.interface';

export class LoginUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: InterfaceJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async getCookieJwt(email: string) {
    const user = await this.userRepository.findByEmail(email);
    this.logger.log(`Login`, `User ${user.name} logged.`);
    const payload: InterfaceJwtServicePayload = { username: user.name };
    const token = await this.jwtTokenService.createToken(payload);
    return token;
  }

  async validateLogin(email: string, pass: string): Promise<UserModel> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const valid = await this.bcryptService.compare(pass, user.password);
    if (valid) {
      return user;
    }
    return null;
  }

  async validateLoginJwt(name: string): Promise<UserModel> {
    const user = await this.userRepository.findByName(name);
    if (!user) {
      return null;
    }
    return user;
  }
}
