import { Scene } from '@/modules/scenes/entities/scene.entity';
import { Movie } from '@/modules/movies/entities/movie.entity';
import { BaseSeeder } from './base.seeder';

export class SceneSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const sceneRepository = this.dataSource.getRepository(Scene);
    const movieRepository = this.dataSource.getRepository(Movie);

    const movies = await movieRepository.find();
    if (movies.length === 0) {
      throw new Error('No movies found. Please seed movies first.');
    }

    const scenes = [
      {
        movie_id: movies[0].id,
        title: 'Opening Sequence',
        description:
          'The dramatic opening scene that sets the tone for the entire movie.',
      },
      {
        movie_id: movies[0].id,
        title: 'The Chase',
        description: 'A high-speed chase through the city streets.',
      },
      {
        movie_id: movies[0].id,
        title: 'Climactic Battle',
        description: 'The final confrontation between hero and villain.',
      },
      {
        movie_id: movies[1].id,
        title: 'First Meeting',
        description:
          'The moment when the two main characters first encounter each other.',
      },
      {
        movie_id: movies[1].id,
        title: 'Romantic Dinner',
        description: 'An intimate dinner scene with beautiful city views.',
      },
      {
        movie_id: movies[1].id,
        title: 'The Proposal',
        description: 'The emotional climax where love is declared.',
      },
      {
        movie_id: movies[2].id,
        title: 'Discovery',
        description: 'The team discovers the entrance to the ancient temple.',
      },
      {
        movie_id: movies[2].id,
        title: 'Temple Exploration',
        description: 'Navigating through traps and puzzles in the temple.',
      },
      {
        movie_id: movies[2].id,
        title: 'The Revelation',
        description: 'Uncovering the truth behind the temple and its secrets.',
      },
    ];

    await sceneRepository.upsert(scenes, ['movie_id', 'title']);
    console.log(`   Upserted ${scenes.length} scenes`);
  }
}
