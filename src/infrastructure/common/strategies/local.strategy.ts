import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserModel } from '../../../domain/model/user.model';
import { LoggerService } from '../../../infrastructure/logger/logger.service';
import { UseCaseProxy } from '../../../infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../../infrastructure/usecases-proxy/usecases-proxy.module';
import { LoginUseCase } from '../../../usecases/auth/login.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCasesProxy: UseCaseProxy<LoginUseCase>,
    private readonly logger: LoggerService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserModel> {
    const user = await this.loginUseCasesProxy
      .getInstance()
      .validateLogin(email, password);
    if (user == null) {
      this.logger.error('Unauthorized', 'LocalStrategy');
      throw new UnauthorizedException();
    }
    return user;
  }
}
