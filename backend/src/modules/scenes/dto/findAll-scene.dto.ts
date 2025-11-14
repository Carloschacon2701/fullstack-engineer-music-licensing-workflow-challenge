import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FindAllSceneDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;
}
