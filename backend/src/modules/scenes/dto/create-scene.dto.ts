import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateSceneDto {
  @IsNumber()
  @IsNotEmpty()
  movie_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
