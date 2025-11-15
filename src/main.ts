import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { setupApp } from './common/helpers/app-setup.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);
  swaggerConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
