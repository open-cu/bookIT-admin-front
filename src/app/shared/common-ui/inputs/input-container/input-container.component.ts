import {Component, Input} from '@angular/core';
import {ChipInputComponent} from '../chip-input/chip-input.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {SingleSelectInputComponent} from '../single-select-input/single-select-input.component';
import {TextInputComponent} from '../text-input/text-input.component';
import {ImageInputComponent} from '../image-input/image-input.component';
import {DateRangeInputComponent} from '../date-range-input/date-range-input.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MultipleSelectInputComponent} from '../multiple-select-input/multiple-select-input.component';
import {DateTimeInputComponent} from '../date-time-input/date-time-input.component';
import {DateInputComponent} from '../date-input/date-input.component';

export type InputType = 'text' | 'date' | 'dateTime' | 'dateRange' | 'select' | 'multiple-select' | 'images' | 'chips' | 'number';

@Component({
  selector: 'app-input-container',
  imports: [
    ChipInputComponent,
    NumberInputComponent,
    SingleSelectInputComponent,
    TextInputComponent,
    ImageInputComponent,
    DateRangeInputComponent,
    ReactiveFormsModule,
    MultipleSelectInputComponent,
    DateTimeInputComponent,
    DateInputComponent,
  ],
  templateUrl: './input-container.component.html',
  styleUrl: './input-container.component.css',
})
export class InputContainerComponent {
  @Input('type') inputType: InputType = 'text';
  @Input('params') additionalParams: { [key in InputType]?: any } = {};

  @Input ('control') usedControl!: FormControl<any>;
  @Input () placeholder: string = '';
}
