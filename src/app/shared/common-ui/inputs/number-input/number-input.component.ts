import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TuiInputNumberDirective} from "@taiga-ui/kit";
import {TuiError, TuiTextfieldComponent} from "@taiga-ui/core";
import {InputComponent} from '../input.component';

@Component({
  selector: 'app-number-input',
  imports: [
    ReactiveFormsModule,
    TuiInputNumberDirective,
    TuiTextfieldComponent,
    TuiError,
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css'
})
export class NumberInputComponent extends InputComponent<number> {
  @Input({required: true}) max!: number;
  @Input({required: true}) min!: number;
  @Input() step: number = 1;

  protected onNumericStep(number: number) {
    const value = this.formControl.value;
    if (!value) {
      this.formControl.patchValue(number >= 0 ? this.min : this.max);
      return;
    }
    this.formControl.patchValue(value + number);
  }
}
