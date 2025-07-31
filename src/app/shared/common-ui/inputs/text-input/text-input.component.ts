import {Component, forwardRef} from '@angular/core';
import {TuiError, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core';
import {InputComponent} from '../input.component';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    ReactiveFormsModule,
    TuiError
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    }
  ]
})
export class TextInputComponent extends InputComponent<string> {

}
