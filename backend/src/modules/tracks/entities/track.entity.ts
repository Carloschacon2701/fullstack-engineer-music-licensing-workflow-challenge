import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Scene } from '../../scenes/entities/scene.entity';
import { Song } from '../../songs/entities/song.entity';
import { License } from '../../licenses/entities/license.entity';

@Entity('Track')
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'scene_id' })
  scene_id: number;

  @Column({ name: 'song_id' })
  song_id: number;

  @Column({ name: 'start_time_seconds', type: 'int' })
  start_time_seconds: number;

  @Column({ name: 'end_time_seconds', type: 'int' })
  end_time_seconds: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Scene, (scene) => scene.tracks)
  @JoinColumn({ name: 'scene_id' })
  scene: Scene;

  @ManyToOne(() => Song, (song) => song.tracks)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @OneToOne(() => License, (license) => license.track)
  license: License;
}
