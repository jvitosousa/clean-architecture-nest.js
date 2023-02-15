import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { Despesa } from '../entities/despesa.entity';
import { User } from '../entities/user.entity';
import { LoggerModule } from '../logger/logger.module';
import { DataBaseDespesaRepository } from './despesa.repository';
import { DataBaseUserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User, Despesa]),
    LoggerModule,
  ],
  providers: [DataBaseUserRepository, DataBaseDespesaRepository],
  exports: [DataBaseUserRepository, DataBaseDespesaRepository],
})
export class RepositoriesModule {}
