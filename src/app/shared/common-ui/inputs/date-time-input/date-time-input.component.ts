import {Component, forwardRef} from '@angular/core';
import {FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {TuiInputDateTimeDirective} from '@taiga-ui/kit';
import {TuiCalendar, TuiError, TuiTextfieldComponent, TuiTextfieldDropdownDirective} from '@taiga-ui/core';
import {InputComponent} from '../input.component';
import {TuiDay, TuiTime} from '@taiga-ui/cdk';

@Component({
  selector: 'app-date-time-input',
  imports: [
    FormsModule,
    TuiError,
    TuiTextfieldComponent,
    TuiCalendar,
    TuiTextfieldDropdownDirective,
    TuiInputDateTimeDirective,
    ReactiveFormsModule
  ],
  templateUrl: './date-time-input.component.html',
  styleUrl: './date-time-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true,
    }
  ]
})
export class DateTimeInputComponent extends InputComponent<[TuiDay, TuiTime]> {
  protected override convertToExternalValue(internalValue: [TuiDay, TuiTime] | null): Date | null {
    if (!internalValue) {
      return null;
    }
    const {hours = 0, minutes = 0} = internalValue?.[1] ?? {};
    let result = internalValue[0].toLocalNativeDate();
    result.setUTCHours(hours, minutes);
    return result;
  }

  protected override convertToInternalValue(externalValue: Date | null): [TuiDay, TuiTime] | null {
    return externalValue
      ? [
        TuiDay.fromUtcNativeDate(externalValue),
        new TuiTime(externalValue.getUTCHours(), externalValue.getUTCMinutes()),
      ]
      : null;
  }
}
