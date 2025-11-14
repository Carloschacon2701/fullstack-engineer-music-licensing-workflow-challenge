import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('Scene')
export class Scene {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  movie_id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Movie, (movie) => movie.scenes)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @OneToMany(() => Track, (track) => track.scene)
  tracks: Track[];
}
