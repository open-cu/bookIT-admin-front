import {ValidatorFn, Validators} from '@angular/forms';

export function nameValidator(required: boolean = true): ValidatorFn {
  const validators = [
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Zа-яА-Я\s\-']+$/),
  ]
  if (required) {
    validators.push(Validators.required);
  }
  return Validators.compose(validators) as ValidatorFn;
}
