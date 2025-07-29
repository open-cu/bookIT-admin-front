import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppValidators} from '../../validators/app.validators';
@Component({
  selector: 'app-filter-block',
  imports: [],
  template: '',
})
export abstract class InputComponent<T> {
  @Input('control') formControl!: FormControl<T | null>;
  @Input() placeholder: string = '';

  protected get errorMessage() {
    return this.isInvalid
      ? AppValidators.getErrorMessage(this.formControl.errors)
      : null;
  }

  protected get isValid() {
    return this.formControl.untouched  ||  this.formControl.valid;
  }

  protected get isInvalid() {
    return !this.isValid;
  }
}
