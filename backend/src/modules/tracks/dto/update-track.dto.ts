import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  start_time_seconds?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  end_time_seconds?: number;
}
