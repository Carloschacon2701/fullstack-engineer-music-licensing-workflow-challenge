import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateSongDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty.title') })
  @IsString({ message: i18nValidationMessage('validation.isString.title') })
  title: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.artist'),
  })
  @IsString({ message: i18nValidationMessage('validation.isString.artist') })
  artist: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.genre'),
  })
  @IsString({ message: i18nValidationMessage('validation.isString.genre') })
  genre: string;
}
