import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FindAllMoviesDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  search?: string;
}
