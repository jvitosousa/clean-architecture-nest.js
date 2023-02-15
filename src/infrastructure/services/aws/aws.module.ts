import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../../../infrastructure/config/environment-config/environment-config.module';
import { AwsService } from './aws.service';

@Module({
  imports: [EnvironmentConfigModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
