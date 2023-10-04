import 'module-alias/register';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { ValidationConfig } from '@src/config/validation.config';
import { ValidatorModule } from '@src/validators/validator.module';

import { AppModule } from './app.module';
import { IAppConfig } from './config/app.config';
import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService).get<IAppConfig>('app');

  app.enableCors({
    origin: appConfig.allowedOrigins,
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.setGlobalPrefix(appConfig.apiPrefix);

  useContainer(app.select(ValidatorModule), { fallbackOnErrors: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription('NestJS boilerplate. Auth, TypeORM, MySql')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app
    .listen(appConfig.port)
    .then(() => {
      LoggerService.log(`API is listening on ${appConfig.port}`);
    })
    .catch((error: any) => LoggerService.error(error));
}

bootstrap();
