import {Component, forwardRef, Input} from '@angular/core';
import {FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiError, TuiTextfieldComponent} from "@taiga-ui/core";
import {tuiCreateTimePeriods, TuiInputTimeDirective, TuiTooltip} from "@taiga-ui/kit";
import {InputComponent} from '../input.component';
import type {MaskitoTimeMode} from '@maskito/kit';
import {TuiTime} from '@taiga-ui/cdk';

@Component({
  selector: 'app-time-input',
  imports: [
    FormsModule,
    TuiError,
    TuiTextfieldComponent,
    ReactiveFormsModule,
    TuiInputTimeDirective,
    TuiTooltip
  ],
  templateUrl: './time-input.component.html',
  styleUrl: './time-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true,
    }
  ]
})
export class TimeInputComponent extends InputComponent<TuiTime> {
  @Input() mode: MaskitoTimeMode = 'HH:MM';
  @Input() useHint = true;

  protected acceptableValues = [
    ...tuiCreateTimePeriods(undefined, undefined, [0]),
  ];
}
