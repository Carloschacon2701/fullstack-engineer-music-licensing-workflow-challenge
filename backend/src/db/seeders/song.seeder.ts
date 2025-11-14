import { Song } from '@/modules/songs/entities/song.entity';
import { BaseSeeder } from './base.seeder';

export class SongSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const songRepository = this.dataSource.getRepository(Song);

    const songs = [
      {
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        genre: 'Rock',
      },
      {
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        genre: 'Rock',
      },
      {
        title: 'Billie Jean',
        artist: 'Michael Jackson',
        genre: 'Pop',
      },
      {
        title: 'Hotel California',
        artist: 'Eagles',
        genre: 'Rock',
      },
      {
        title: 'Sweet Child O Mine',
        artist: "Guns N' Roses",
        genre: 'Rock',
      },
      {
        title: 'Imagine',
        artist: 'John Lennon',
        genre: 'Pop',
      },
      {
        title: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        genre: 'Grunge',
      },
      {
        title: 'Like a Rolling Stone',
        artist: 'Bob Dylan',
        genre: 'Folk Rock',
      },
      {
        title: 'Thunderstruck',
        artist: 'AC/DC',
        genre: 'Rock',
      },
      {
        title: 'Purple Rain',
        artist: 'Prince',
        genre: 'Pop Rock',
      },
    ];

    await songRepository.upsert(songs, ['title', 'artist']);
    console.log(`   Upserted ${songs.length} songs`);
  }
}
