import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateLicenseDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  track_id: number;
}
