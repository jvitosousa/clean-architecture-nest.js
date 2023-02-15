import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../../../domain/model/user.model';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { LoginUseCase } from '../../../usecases/auth/login.usecase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCasesProxy: UseCaseProxy<LoginUseCase>,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data) {
            throw new UnauthorizedException();
          }
          return data;
        },
      ]),
    });
  }

  async validate(payload: any): Promise<UserModel> {
    const user = await this.loginUseCasesProxy
      .getInstance()
      .validateLoginJwt(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...user };
  }
}
