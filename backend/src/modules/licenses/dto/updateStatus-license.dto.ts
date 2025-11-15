import { IsEnum, IsNotEmpty } from 'class-validator';
import { LicenseStatusEnum } from '../entities/license.status.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateLicenseStatusDto {
  @IsEnum(LicenseStatusEnum, {
    message: i18nValidationMessage('validation.isEnum.status'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.status'),
  })
  status: LicenseStatusEnum;
}
