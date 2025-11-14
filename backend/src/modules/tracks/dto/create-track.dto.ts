import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsNumber()
  @IsNotEmpty()
  scene_id: number;

  @IsNumber()
  @IsNotEmpty()
  song_id: number;

  @IsNumber()
  @IsNotEmpty()
  start_time_seconds: number;

  @IsNumber()
  @IsNotEmpty()
  end_time_seconds: number;
}
