import {AbstractControl, ValidatorFn} from '@angular/forms';
import {TuiValidationError} from '@taiga-ui/cdk';

export function maxFilesLengthValidator(maxLength: number): ValidatorFn {
  return ({value}: AbstractControl) =>
    value.length > maxLength
      ? {
        maxLength: new TuiValidationError(
          `Error: maximum limit of uploaded files: ${maxLength}`,
        ),
      }
      : null;
}
