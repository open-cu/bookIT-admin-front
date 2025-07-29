import {Component, Input} from '@angular/core';
import {InputComponent} from '../input.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiInputChipComponent, TuiInputChipDirective} from '@taiga-ui/kit';
import {TuiError, TuiTextfieldMultiComponent, TuiTextfieldOptionsDirective} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';

@Component({
  selector: 'app-chip-input',
  imports: [
    ReactiveFormsModule,
    TuiInputChipComponent,
    TuiInputChipDirective,
    TuiTextfieldMultiComponent,
    TuiTextfieldOptionsDirective,
    TuiItem,
    TuiError
  ],
  templateUrl: './chip-input.component.html',
  styleUrl: './chip-input.component.css'
})
export class ChipInputComponent extends InputComponent<string[]> {
  @Input() separator: string | RegExp = new RegExp(/\r?\n|\r/);
  @Input() unique: boolean = false;
}
