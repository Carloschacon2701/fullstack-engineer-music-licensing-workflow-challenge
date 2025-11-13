import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { TracksModule } from './tracks/tracks.module';
import { ScenesModule } from './scenes/scenes.module';
import { SongsModule } from './songs/songs.module';
import { LicensesModule } from './licenses/licenses.module';

@Module({
  imports: [
    MoviesModule,
    TracksModule,
    ScenesModule,
    SongsModule,
    LicensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
