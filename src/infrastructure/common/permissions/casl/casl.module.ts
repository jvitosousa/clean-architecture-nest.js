import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../../../usecases-proxy/usecases-proxy.module';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';

@Module({
  imports: [UsecasesProxyModule.register()],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
