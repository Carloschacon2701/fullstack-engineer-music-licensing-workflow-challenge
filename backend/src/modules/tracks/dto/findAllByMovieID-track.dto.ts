import { IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class FindAllByMovieIdTrackDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @IsNumber()
  @IsNotEmpty()
  movieId: number;
}
