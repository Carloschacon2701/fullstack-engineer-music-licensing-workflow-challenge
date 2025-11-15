import { IsInt, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTrackDto {
  @IsInt({ message: i18nValidationMessage('validation.isInt.scene_id') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.scene_id'),
  })
  scene_id: number;

  @IsInt({ message: i18nValidationMessage('validation.isInt.song_id') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.song_id'),
  })
  song_id: number;

  @IsInt({
    message: i18nValidationMessage('validation.isInt.start_time_seconds'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.start_time_seconds'),
  })
  start_time_seconds: number;

  @IsInt({
    message: i18nValidationMessage('validation.isInt.end_time_seconds'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty.end_time_seconds'),
  })
  end_time_seconds: number;
}
