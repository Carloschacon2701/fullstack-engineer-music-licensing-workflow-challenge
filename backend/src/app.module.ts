import { Module } from '@nestjs/common';
import { MoviesModule } from './modules/movies/movies.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { ScenesModule } from './modules/scenes/scenes.module';
import { SongsModule } from './modules/songs/songs.module';
import { LicensesModule } from './modules/licenses/licenses.module';
import { I18nModule } from 'nestjs-i18n';
import { AppConfigModule } from './config/config.module';
import { createI18nConfig } from './config/i18n.config';
@Module({
  imports: [
    AppConfigModule,
    MoviesModule,
    TracksModule,
    ScenesModule,
    SongsModule,
    LicensesModule,
    I18nModule.forRootAsync({
      useFactory: createI18nConfig,
      inject: [AppConfigModule],
    }),
  ],
})
export class AppModule {}
