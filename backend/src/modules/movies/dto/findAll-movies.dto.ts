import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FindAllMoviesDto {
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.isInt.page') })
  @IsPositive({ message: i18nValidationMessage('validation.isPositive.page') })
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.isInt.limit') })
  @IsPositive({ message: i18nValidationMessage('validation.isPositive.limit') })
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString.search') })
  search?: string;
}
