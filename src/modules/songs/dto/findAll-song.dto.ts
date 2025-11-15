import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsPositive, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FindAllSongDto {
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.isInt.page') })
  @IsPositive({ message: i18nValidationMessage('validation.isPositive.page') })
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.isInt.limit') })
  @IsPositive({ message: i18nValidationMessage('validation.isPositive.limit') })
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString.title') })
  title?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString.artist') })
  artist?: string;
}
