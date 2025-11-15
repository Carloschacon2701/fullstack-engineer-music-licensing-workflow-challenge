import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nValidationPipe } from 'nestjs-i18n';
import { CatchEverythingFilter } from '../filters/catchEverything.filter';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { API_PREFIX } from '../constants/api.constants';

export function setupApp(app: INestApplication): void {
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(
    new CatchEverythingFilter(),
    new I18nValidationExceptionFilter(),
  );
}
