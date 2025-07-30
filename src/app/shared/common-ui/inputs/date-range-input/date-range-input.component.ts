import { Component } from '@angular/core';
import {InputComponent} from '../input.component';
import {
  TuiCalendarRange,
  tuiCreateDefaultDayRangePeriods,
  TuiInputDateRangeDirective
} from '@taiga-ui/kit';
import {TuiDayRange} from '@taiga-ui/cdk';
import {
  TuiError,
  TuiTextfieldComponent,
  TuiTextfieldDropdownDirective,
} from '@taiga-ui/core';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-range-input',
  imports: [
    TuiTextfieldComponent,
    TuiInputDateRangeDirective,
    ReactiveFormsModule,
    TuiCalendarRange,
    TuiTextfieldDropdownDirective,
    TuiError,
  ],
  templateUrl: './date-range-input.component.html',
  styleUrl: './date-range-input.component.css'
})
export class DateRangeInputComponent extends InputComponent<TuiDayRange> {
  protected readonly items = tuiCreateDefaultDayRangePeriods();

  public get content(): string {
    const {value} = this.formControl;

    return value
      ? String(this.items.find((period) => period.range.daySame(value)) || '')
      : '';
  }
}
