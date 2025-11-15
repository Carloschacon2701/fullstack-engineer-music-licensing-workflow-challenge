import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateLicenseDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.track_id'),
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt.track_id') })
  @IsPositive({
    message: i18nValidationMessage('validation.isPositive.track_id'),
  })
  track_id: number;
}
