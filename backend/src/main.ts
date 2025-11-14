import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchEverythingFilter } from './common/filters/catchEverything.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new CatchEverythingFilter());
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
