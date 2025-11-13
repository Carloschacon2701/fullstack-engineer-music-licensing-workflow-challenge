import { ConfigModule as NestConfigModule } from '@nestjs/config';

export const AppConfigModule = NestConfigModule.forRoot({ isGlobal: true });
