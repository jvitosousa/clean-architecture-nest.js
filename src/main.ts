import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const env = process.env.NODE_ENV;

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  // swagger config
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Onfly Tests Nestjs')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
