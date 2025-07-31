import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
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
  styleUrl: './number-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    }
  ]
})
export class NumberInputComponent extends InputComponent<number> {
  @Input({required: true}) max!: number;
  @Input({required: true}) min!: number;
  @Input() step: number = 1;

  protected onNumericStep(number: number) {
    const value = this.control.value;
    if (!value) {
      this.control.patchValue(number >= 0 ? this.min : this.max);
      return;
    }
    this.control.patchValue(value + number);
  }
}
