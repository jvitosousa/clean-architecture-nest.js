import { InterfaceAws } from '../../../domain/adapters/aws.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../../../infrastructure/config/environment-config/environment-config.service';
import * as Aws from 'aws-sdk';

@Injectable()
export class AwsService implements InterfaceAws {
  constructor(
    @Inject(EnvironmentConfigService)
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {
    Aws.config.update({
      accessKeyId: this.environmentConfigService.getAccessKeyId(),
      secretAccessKey: this.environmentConfigService.getSecretAws(),
      region: this.environmentConfigService.getRegion(),
    });
  }
  async sendEmail(
    toAddress: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const ses = new Aws.SES();
    const params = {
      Source: 'jvitosousa@gmail.com',
      Destination: {
        ToAddresses: ['onflyteste@gmail.com'],
      },
      Message: {
        Body: {
          Text: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    };
    await ses.sendEmail(params).promise();
  }
}
