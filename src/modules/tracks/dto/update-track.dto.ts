import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateTrackDto {
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.isInt.start_time_seconds'),
  })
  @IsPositive({
    message: i18nValidationMessage('validation.isPositive.start_time_seconds'),
  })
  @Transform(({ value }) => parseInt(value))
  start_time_seconds?: number;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.isInt.end_time_seconds'),
  })
  @IsPositive({
    message: i18nValidationMessage('validation.isPositive.end_time_seconds'),
  })
  @Transform(({ value }) => parseInt(value))
  end_time_seconds?: number;
}
