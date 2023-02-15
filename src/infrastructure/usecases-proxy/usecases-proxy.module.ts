import { DynamicModule, Module } from '@nestjs/common';
import { GetUserUseCases } from '../../usecases/user/getUser.usecases';
import { CreateUserUseCases } from '../../usecases/user/createUser.usecases';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { DataBaseUserRepository } from '../repositories/user.repository';
import { UseCaseProxy } from './usecases-proxy';
import { LoggerService } from '../logger/logger.service';
import { DeleteUserUsecase } from '../../usecases/user/deleteUser.usecases';
import { JwtModule } from '../services/jwt/jwt.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { LoginUseCase } from '../../usecases/auth/login.usecase';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { DataBaseDespesaRepository } from '../repositories/despesa.repository';
import { CreateDespesaUseCases } from '../../usecases/despesas/createDespesa.usecase';
import { UpdateDespesaUsecase } from '../../usecases/despesas/updateDespesa.usecase';
import { AwsService } from '../services/aws/aws.service';
import { AwsModule } from '../services/aws/aws.module';
import { DeleteDespesaUsecase } from '../../usecases/despesas/deleteDespesa.usecase';
import { GetDespesaUseCase } from '../../usecases/despesas/getDespesa.usecase';
import { GetDespesasUseCase } from '../../usecases/despesas/getDespesas.usecase';
import { LogoutUseCases } from '../../usecases/auth/logout.usecase';

@Module({
  imports: [
    LoggerModule,
    RepositoriesModule,
    ExceptionsModule,
    JwtModule,
    EnvironmentConfigModule,
    BcryptModule,
    AwsModule,
  ],
})
export class UsecasesProxyModule {
  static GET_USER_USECASES_PROXY = 'GetUserUseCases';
  static POST_USER_USECASES_PROXY = 'CreateUserUseCases';
  static DELETE_USER_USECASES_PROXY = 'DeleteUserUseCases';
  static LOGIN_USECASES_PROXY = 'LoginUseCase';
  static POST_DESPESA_USECASES_PROXY = 'CreateDespesaUseCases';
  static UPDATE_DESPESA_USECASES_PROXY = 'UpdateDespesaUsecase';
  static DELETE_DESPESA_USECASES_PROXY = 'DeleteDespesaUsecase';
  static GET_DESPESA_USECASES_PROXY = 'GetDespesaUseCase';
  static GET_DESPESAS_USECASES_PROXY = 'GetDespesasUseCase';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCases';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [DataBaseUserRepository],
          provide: UsecasesProxyModule.GET_USER_USECASES_PROXY,
          useFactory: (userRepository: DataBaseUserRepository) =>
            new UseCaseProxy(new GetUserUseCases(userRepository)),
        },
        {
          inject: [DataBaseUserRepository, LoggerService],
          provide: UsecasesProxyModule.POST_USER_USECASES_PROXY,
          useFactory: (
            useRepository: DataBaseUserRepository,
            logger: LoggerService,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new CreateUserUseCases(bcryptService, useRepository, logger),
            ),
        },
        {
          inject: [DataBaseUserRepository, LoggerService],
          provide: UsecasesProxyModule.DELETE_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DataBaseUserRepository,
            logger: LoggerService,
          ) => new UseCaseProxy(new DeleteUserUsecase(userRepository, logger)),
        },
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DataBaseUserRepository,
            BcryptService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            environmentConfigService: EnvironmentConfigService,
            userRepository: DataBaseUserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(
                logger,
                jwtTokenService,
                environmentConfigService,
                userRepository,
                bcryptService,
              ),
            ),
        },
        {
          inject: [DataBaseDespesaRepository, LoggerService, AwsService],
          provide: UsecasesProxyModule.POST_DESPESA_USECASES_PROXY,
          useFactory: (
            despesaRepository: DataBaseDespesaRepository,
            logger: LoggerService,
            awsService: AwsService,
          ) =>
            new UseCaseProxy(
              new CreateDespesaUseCases(despesaRepository, logger, awsService),
            ),
        },
        {
          inject: [DataBaseDespesaRepository, LoggerService],
          provide: UsecasesProxyModule.UPDATE_DESPESA_USECASES_PROXY,
          useFactory: (
            despesaRepository: DataBaseDespesaRepository,
            logger: LoggerService,
          ) => {
            return new UseCaseProxy(
              new UpdateDespesaUsecase(despesaRepository, logger),
            );
          },
        },
        {
          inject: [DataBaseDespesaRepository, LoggerService],
          provide: UsecasesProxyModule.DELETE_DESPESA_USECASES_PROXY,
          useFactory: (
            despesaRepository: DataBaseDespesaRepository,
            logger: LoggerService,
          ) => {
            return new UseCaseProxy(
              new DeleteDespesaUsecase(despesaRepository, logger),
            );
          },
        },
        {
          inject: [DataBaseDespesaRepository, LoggerService],
          provide: UsecasesProxyModule.GET_DESPESA_USECASES_PROXY,
          useFactory: (
            despesaRepository: DataBaseDespesaRepository,
            logger: LoggerService,
          ) => {
            return new UseCaseProxy(
              new GetDespesaUseCase(despesaRepository, logger),
            );
          },
        },
        {
          inject: [DataBaseDespesaRepository, LoggerService],
          provide: UsecasesProxyModule.GET_DESPESAS_USECASES_PROXY,
          useFactory: (
            despesaRepository: DataBaseDespesaRepository,
            logger: LoggerService,
          ) => {
            return new UseCaseProxy(
              new GetDespesasUseCase(despesaRepository, logger),
            );
          },
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => {
            return new UseCaseProxy(new LogoutUseCases());
          },
        },
      ],
      exports: [
        UsecasesProxyModule.GET_USER_USECASES_PROXY,
        UsecasesProxyModule.POST_USER_USECASES_PROXY,
        UsecasesProxyModule.DELETE_USER_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.POST_DESPESA_USECASES_PROXY,
        UsecasesProxyModule.UPDATE_DESPESA_USECASES_PROXY,
        UsecasesProxyModule.DELETE_DESPESA_USECASES_PROXY,
        UsecasesProxyModule.GET_DESPESA_USECASES_PROXY,
        UsecasesProxyModule.GET_DESPESAS_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
      ],
    };
  }
}
