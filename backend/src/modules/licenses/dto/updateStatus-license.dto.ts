import { IsEnum, IsNotEmpty } from 'class-validator';
import { LicenseStatusEnum } from '../entities/license.status.enum';

export class UpdateLicenseStatusDto {
  @IsEnum(LicenseStatusEnum)
  @IsNotEmpty()
  status: LicenseStatusEnum;
}
