import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMovieDto {
  @IsString({ message: i18nValidationMessage('validation.isString.title') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty.title') })
  title: string;

  @IsString({
    message: i18nValidationMessage('validation.isString.description'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.description'),
  })
  description: string;
}
