import {Component, forwardRef, Input} from '@angular/core';
import {FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiInputChipDirective,
  TuiMultiSelectGroupDirective,
} from "@taiga-ui/kit";
import {
  TuiError,
  TuiSelectLike,
  TuiTextfieldDropdownDirective,
  TuiTextfieldMultiComponent
} from "@taiga-ui/core";
import {InputComponent} from '../input.component';
import {SelectOption} from '../../creation-block/creation-config';
import {TuiIdentityMatcher, TuiStringHandler} from '@taiga-ui/cdk';

@Component({
  selector: 'app-multiple-select-input',
  imports: [
    FormsModule,
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiError,
    TuiMultiSelectGroupDirective,
    TuiSelectLike,
    TuiTextfieldMultiComponent,
    TuiInputChipDirective,
    TuiTextfieldDropdownDirective,
    ReactiveFormsModule
  ],
  templateUrl: './multiple-select-input.component.html',
  styleUrl: './multiple-select-input.component.css',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleSelectInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultipleSelectInputComponent),
      multi: true,
    }
  ]
})
export class MultipleSelectInputComponent extends InputComponent<any> {
  @Input({required: true}) options!: SelectOption[];

  protected stringify: TuiStringHandler<SelectOption> = option => option.label ?? option.value;
  protected matcher: TuiIdentityMatcher<SelectOption> = (a, b) => a.value === b.value;

  protected override convertToExternalValue(internalValue: SelectOption[] | null): any[] | null {
    return internalValue
      ? internalValue.map(select => select.value)
      : null;
  }

  protected override convertToInternalValue(externalValue: any[] | null): SelectOption[] | null {
    return externalValue
      ? externalValue.map(value => this.options.find(option => option.value === value)!) ?? null
      : null;
  }
}
