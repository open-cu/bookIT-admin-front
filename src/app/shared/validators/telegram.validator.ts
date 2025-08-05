import {ValidatorFn, Validators} from '@angular/forms';

export function telegramValidator(): ValidatorFn {
  const validators = [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^@[a-zA-Z0-9_]+$/),
  ]
  return Validators.compose(validators) as ValidatorFn;
}
