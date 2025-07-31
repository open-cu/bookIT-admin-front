import {Component, Input} from '@angular/core';
import {ChipInputComponent} from '../chip-input/chip-input.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {SingleSelectInputComponent} from '../single-select-input/single-select-input.component';
import {TextInputComponent} from '../text-input/text-input.component';
import {ImageInputComponent} from '../image-input/image-input.component';
import {DateRangeInputComponent} from '../date-range-input/date-range-input.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

export type InputType = 'text' | 'dateRange' | 'select' | 'images' | 'multiple' | 'number';

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
