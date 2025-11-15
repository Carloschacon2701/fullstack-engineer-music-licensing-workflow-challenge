import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchEverythingFilter } from './common/filters/catchEverything.filter';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new CatchEverythingFilter(),
    new I18nValidationExceptionFilter(),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
