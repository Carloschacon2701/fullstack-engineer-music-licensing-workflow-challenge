import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FindAllSceneDto {
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.isInt.limit') })
  @IsPositive({ message: i18nValidationMessage('validation.isPositive.limit') })
  limit?: number;

  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.isInt.page') })
  @IsPositive({ message: i18nValidationMessage('validation.isPositive.page') })
  page?: number;
}
