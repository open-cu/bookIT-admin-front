import {FormGroup, ValidatorFn} from '@angular/forms';

export type requiredIfOptions = { [key: string]: (group: FormGroup) => boolean };

export function requiredIfGroupValidator(conditions: requiredIfOptions): ValidatorFn {
  return ((group: FormGroup) => {
    for (const [key, condition] of Object.entries(conditions)) {
      console.log(condition(group));
      if (condition(group) && isEmptyInput(group.get(key)?.value)) {
        return { requiredForm: key };
      }
    }
    return null;
  }) as ValidatorFn;
}

function isEmptyInput(value: any): boolean {
  if (!value) {
    return true;
  }
  return typeof value === 'string' && value.trim().length === 0;
}
