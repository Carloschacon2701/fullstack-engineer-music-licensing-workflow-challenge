import { HttpException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class I18nException extends HttpException {
  constructor(messageKey: string, statusCode: number) {
    const i18n = I18nContext.current();
    let message = messageKey;

    if (i18n) {
      message = i18n.t(messageKey);
    }

    super(message, statusCode);
  }
}
