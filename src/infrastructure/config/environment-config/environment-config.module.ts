import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'teste'
          ? './env/teste.env'
          : './env/local.env',
      ignoreEnvFile:
        process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'teste'
          ? false
          : true,
      isGlobal: true,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
