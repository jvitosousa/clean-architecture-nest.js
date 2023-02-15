import {
  Inject,
  Post,
  Controller,
  UseGuards,
  Req,
  Body,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginGuard } from '../../../infrastructure/common/guard/login.guard';
import { UseCaseProxy } from '../../../infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../../infrastructure/usecases-proxy/usecases-proxy.module';
import { LoginUseCase } from '../../../usecases/auth/login.usecase';
import { JwtGuard } from '../../../infrastructure/common/guard/jwt.guard';
import { AuthLoginDto } from './authLogin.dto';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecase';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCasesProxy: UseCaseProxy<LoginUseCase>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUseCasesProxy: UseCaseProxy<LogoutUseCases>,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const token = await this.loginUseCasesProxy
      .getInstance()
      .getCookieJwt(auth.email);
    request.res.cookie('auth-cookie', token, { httpOnly: true });
    return { msg: 'success' };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Req() request: any) {
    const cookie = await this.logoutUseCasesProxy.getInstance().execute();
    request.res.setHeader('set-cookie', cookie);
    return 'Logout successful';
  }
}
