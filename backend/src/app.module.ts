import { Module } from '@nestjs/common';
import { MoviesModule } from './modules/movies/movies.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { ScenesModule } from './modules/scenes/scenes.module';
import { SongsModule } from './modules/songs/songs.module';
import { LicensesModule } from './modules/licenses/licenses.module';
import { AppConfigModule } from './config/app.config';
import { HealthModule } from './modules/health/health.module';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    MoviesModule,
    TracksModule,
    ScenesModule,
    SongsModule,
    LicensesModule,
    TypeOrmConfig,
    ...AppConfigModule,
    HealthModule,
  ],
})
export class AppModule {}
