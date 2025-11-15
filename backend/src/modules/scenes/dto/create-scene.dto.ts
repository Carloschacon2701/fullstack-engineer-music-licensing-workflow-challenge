import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateSceneDto {
  @IsInt({ message: i18nValidationMessage('validation.isNumber.movie_id') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.movie_id'),
  })
  movie_id: number;

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
