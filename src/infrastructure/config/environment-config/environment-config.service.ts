import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InterfaceAwsConfig } from '../../../domain/config/aws.config';
import { DatabaseConfig } from '../../../domain/config/database.interface';
import { JWTConfig } from '../../../domain/config/jwt.interface';

@Injectable()
export class EnvironmentConfigService
  implements DatabaseConfig, JWTConfig, InterfaceAwsConfig
{
  constructor(private configService: ConfigService) {}
  getSendGridApiKey(): string {
    return this.configService.get<string>('SEND_GRID_KEY');
  }
  getSecretAws(): string {
    return this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  }
  getAccessKeyId(): string {
    return this.configService.get<string>('AWS_ACCESS_KEY_ID');
  }
  getRegion(): string {
    return this.configService.get<string>('AWS_REGION');
  }
  getSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  getExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDatabasePort(): number {
    return this.configService.get<number>('DB_PORT');
  }
  getDatabaseUser(): string {
    return this.configService.get<string>('DB_USER');
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DB_NAME');
  }
  getDatabaseSchema(): string {
    return this.configService.get<string>('DB_SCHEMA');
  }
}
