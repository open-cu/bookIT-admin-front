import {Component, forwardRef} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {TuiCalendar, TuiError, TuiTextfieldComponent, TuiTextfieldDropdownDirective} from '@taiga-ui/core';
import {TuiInputDateDirective} from '@taiga-ui/kit';
import {InputComponent} from '../input.component';
import {TuiDay} from '@taiga-ui/cdk';

@Component({
  selector: 'app-date-input',
  imports: [
    ReactiveFormsModule,
    TuiCalendar,
    TuiError,
    TuiTextfieldComponent,
    TuiInputDateDirective,
    TuiTextfieldDropdownDirective
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    }
  ]
})
export class DateInputComponent extends InputComponent<TuiDay> {
  protected override convertToExternalValue(internalValue: TuiDay | null): Date | null {
    if (!internalValue) {
      return null;
    }
    return internalValue.toLocalNativeDate();
  }

  protected override convertToInternalValue(externalValue: Date | null): TuiDay | null {
    return externalValue
      ? TuiDay.fromUtcNativeDate(externalValue)
      : null;
  }
}
