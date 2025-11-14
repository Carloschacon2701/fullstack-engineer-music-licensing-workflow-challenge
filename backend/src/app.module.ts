import { Module } from '@nestjs/common';
import { MoviesModule } from './modules/movies/movies.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { ScenesModule } from './modules/scenes/scenes.module';
import { SongsModule } from './modules/songs/songs.module';
import { LicensesModule } from './modules/licenses/licenses.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AppConfigModule } from './config/config.module';
import { createI18nConfig } from './config/i18n.config';
import { HealthModule } from './modules/health/health.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    MoviesModule,
    TracksModule,
    ScenesModule,
    SongsModule,
    LicensesModule,
    I18nModule.forRootAsync({
      useFactory: createI18nConfig,
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
    HealthModule,
  ],
})
export class AppModule {}
