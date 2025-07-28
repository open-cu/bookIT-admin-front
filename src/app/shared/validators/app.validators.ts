import {telegramValidator} from './telegram.validator';
import {nameValidator} from './name.validator';
import {ValidationErrors} from '@angular/forms';

export class AppValidators {
  static telegram = telegramValidator();
  static name = (required?: boolean) => nameValidator(required);

  static getErrorMessage(errors: ValidationErrors | null) {
    return getErrorMessage(errors);
  }
}


function getErrorMessage(errors: ValidationErrors | null) {
  if (!errors) {
    return '';
  }

  if (errors['required']) {
    return 'Это поле обязательно для заполнения';
  }

  if (errors['minlength']) {
    const { requiredLength, actualLength } = errors['minlength'];
    return `Минимум ${requiredLength} символов (сейчас ${actualLength})`;
  }

  if (errors['maxlength']) {
    const { requiredLength, actualLength } = errors['maxlength'];
    return `Максимум ${requiredLength} символов (сейчас ${actualLength})`;
  }

  if (errors['pattern']) {
    return 'Поле содержит недопустимые символы';
  }

  return 'Недопустимое значение';
}
