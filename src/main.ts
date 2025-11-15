import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchEverythingFilter } from './common/filters/catchEverything.filter';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { swaggerConfig } from './config/swagger.config';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
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

  swaggerConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
