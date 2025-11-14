import { LicenseStatusEnum } from '@/modules/licenses/entities/license.status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateTrackLicenseStatusDto {
  @IsEnum(LicenseStatusEnum)
  @IsNotEmpty()
  status: LicenseStatusEnum;
}
