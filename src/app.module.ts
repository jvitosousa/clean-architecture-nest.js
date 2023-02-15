import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { LoggerService } from './infrastructure/logger/logger.service';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    JwtServiceModule,
    PassportModule,
    EnvironmentConfigModule,
  ],
  providers: [LoggerService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
