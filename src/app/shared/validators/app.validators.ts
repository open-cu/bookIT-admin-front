import {telegramValidator} from './telegram.validator';
import {nameValidator} from './name.validator';
import {ValidationErrors} from '@angular/forms';
import {maxFilesLengthValidator} from './max-files-length.validator';

export class AppValidators {
  static telegram = telegramValidator();
  static name = (required?: boolean) => nameValidator(required);
  static maxFilesLength = (maxLength: number) => maxFilesLengthValidator(maxLength);

  static getErrorMessage(errors: ValidationErrors | null) {
    return getErrorMessage(errors);
  }
}

const errorMessages = new Map<string, (details: any) => string>([
  ['required', () => 'Это поле обязательно для заполнения'],
  ['min', (details) => {
    const { min, actual } = details;
    return `Минимальное значение: ${min}, введено: ${actual}`;
  }],
  ['max', (details) => {
    const { max, actual } = details;
    return `Максимальное значение: ${max}, введено: ${actual}`;
  }],
  ['minlength', (details) => {
    const { requiredLength, actualLength } = details;
    return `Минимум ${requiredLength} символов (сейчас ${actualLength})`;
  }],
  ['maxlength', (details) => {
    const { requiredLength, actualLength } = details;
    return `Максимум ${requiredLength} символов (сейчас ${actualLength})`;
  }],
  ['pattern', () => 'Поле содержит недопустимые символы']
]);

function getErrorMessage(errors: ValidationErrors | null) {
  if (!errors) {
    return '';
  }

  for (const [error, message] of errorMessages) {
    const details = errors[error];
    if (details) {
      return message(details);
    }
  }

  return 'Недопустимое значение';
}
