import { Module } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { DespesaController } from './despesa/despesa.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [UserController, AuthController, DespesaController],
  providers: [LoggerService],
})
export class ControllersModule {}
