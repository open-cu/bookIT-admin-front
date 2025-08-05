import {Component, forwardRef} from '@angular/core';
import {TuiDay, TuiDayRange} from '@taiga-ui/cdk';
import {InputComponent} from '../input.component';
import {TuiCalendarRange, tuiCreateDefaultDayRangePeriods, TuiInputDateRangeDirective} from '@taiga-ui/kit';
import {TuiError, TuiTextfieldComponent, TuiTextfieldDropdownDirective} from '@taiga-ui/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.component.html',
  imports: [
    TuiTextfieldComponent,
    TuiError,
    TuiInputDateRangeDirective,
    ReactiveFormsModule,
    TuiCalendarRange,
    TuiTextfieldDropdownDirective
  ],
  styleUrls: ['./date-range-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangeInputComponent),
      multi: true,
    }
  ]
})
export class DateRangeInputComponent extends InputComponent<TuiDayRange> {
  protected readonly items = tuiCreateDefaultDayRangePeriods();

  protected override convertToExternalValue(internalValue: TuiDayRange | null): [Date, Date] | null {
    return internalValue
      ? [
        internalValue.from.toLocalNativeDate(),
        internalValue.to.toLocalNativeDate()
      ]
      : null;
  }

  protected override convertToInternalValue(externalValue: [Date, Date] | null): TuiDayRange | null {
    return externalValue
      ? new TuiDayRange(
        TuiDay.fromLocalNativeDate(externalValue[0]),
        TuiDay.fromLocalNativeDate(externalValue[1])
      )
      : null;
  }

  public get content(): string {
    const value = this.control.value;
    return value
      ? String(this.items.find(period => period.range.daySame(value)) || '')
      : '';
  }
}
