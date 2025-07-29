import { Component } from '@angular/core';
import {TuiError, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core';
import {InputComponent} from '../input.component';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    ReactiveFormsModule,
    TuiError
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent extends InputComponent<string> {

}
