import {Component, forwardRef, Input} from '@angular/core';
import {InputComponent} from '../input.component';
import {SelectOption} from '../../creation-block/creation-config';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
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
  styleUrl: './single-select-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SingleSelectInputComponent),
      multi: true,
    }
  ]
})
export class SingleSelectInputComponent extends InputComponent<any> {
  @Input({required: true}) options!: SelectOption[];

  protected stringify: TuiStringHandler<SelectOption> = option => option.label ?? option.value;
  protected matcher: TuiIdentityMatcher<SelectOption> = (a, b) => a.value === b.value;

  protected override convertToExternalValue(internalValue: SelectOption | null): any | null {
    return internalValue
      ? internalValue.value
      : null;
  }

  protected override convertToInternalValue(externalValue: any | null): SelectOption | null {
    return externalValue
      ? this.options.find(option => option.value === externalValue) ?? null
      : null;
  }
}
