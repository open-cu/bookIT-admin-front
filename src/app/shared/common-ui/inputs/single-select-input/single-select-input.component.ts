import {Component, Input} from '@angular/core';
import {InputComponent} from '../input.component';
import {SelectOption} from '../../creation-block/creation-config';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiChevron, TuiDataListWrapperComponent, TuiSelectDirective} from '@taiga-ui/kit';
import {TuiError, TuiTextfieldComponent, TuiTextfieldDropdownDirective} from '@taiga-ui/core';
import {TuiIdentityMatcher, TuiStringHandler} from '@taiga-ui/cdk';

@Component({
  selector: 'app-single-select-input',
  imports: [
    ReactiveFormsModule,
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiSelectDirective,
    TuiTextfieldComponent,
    TuiError,
    TuiTextfieldDropdownDirective
  ],
  templateUrl: './single-select-input.component.html',
  styleUrl: './single-select-input.component.css'
})
export class SingleSelectInputComponent extends InputComponent<any> {
  @Input({required: true}) options!: SelectOption[];

  protected stringify: TuiStringHandler<SelectOption> = option => option.label ?? option.value;
  protected matcher: TuiIdentityMatcher<SelectOption> = (a, b) => a.value === b.value;
}
