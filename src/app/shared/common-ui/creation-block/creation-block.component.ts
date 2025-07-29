import {Component} from '@angular/core';
import {CreationConfig, CreationOptions, CreationReturn, OptionType, SelectOption} from './creation-config';
import {
  TuiButton,
  TuiDialogContext, TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective, TuiTextfieldDropdownDirective, TuiTextfieldMultiComponent, TuiTextfieldOptionsDirective
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiInputChipComponent,
  TuiInputChipDirective, TuiInputNumberDirective,
  TuiSelectDirective
} from '@taiga-ui/kit';
import {TuiIdentityMatcher, TuiItem, TuiStringHandler} from '@taiga-ui/cdk';
import {TypeUtils} from '../../../core/utils/type.utils';
import toArray = TypeUtils.toArray;
import {AppValidators} from '../../validators/app.validators';

type CreationContext = TuiDialogContext<CreationReturn<CreationOptions>, CreationConfig>

@Component({
  selector: 'app-creation-block',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiChevron,
    TuiSelectDirective,
    TuiDataListWrapperComponent,
    TuiTextfieldDropdownDirective,
    FormsModule,
    TuiLabel,
    TuiTextfieldMultiComponent,
    TuiTextfieldOptionsDirective,
    TuiInputChipDirective,
    TuiInputChipComponent,
    TuiItem,
    TuiInputNumberDirective
  ],
  templateUrl: './creation-block.component.html',
  styleUrl: './creation-block.component.css'
})
export class CreationBlockComponent {
  public readonly context = injectContext<CreationContext>();
  protected stringify: TuiStringHandler<SelectOption> = option => option.label ?? option.value;
  protected matcher: TuiIdentityMatcher<SelectOption> = (a, b) => a.value === b.value;
  protected creationForm!: FormGroup;

  protected chipSep = new RegExp(/\r?\n|\r|__/);

  constructor() {
    this.initFormGroup();
  }

  private initFormGroup() {
    const formGroupConfig: Record<string, FormControl> = {};

    for (const configItem of this.context.data.options) {
      const initialValue = configItem.value ?? this.getDefaultValue(configItem.type);
      formGroupConfig[configItem.key] = new FormControl(initialValue, toArray(configItem.validators));
    }
    this.creationForm = new FormGroup(formGroupConfig);
  }

  private getDefaultValue(type: OptionType | undefined): any {
    switch (type) {
      case 'select':
        return undefined;
      case 'multiple':
        return new Array<string>();
      case 'number':
        return null;
      default:
        return '';
    }
  }

  protected onSubmit() {
    if (this.creationForm.invalid) {
      this.creationForm.markAllAsTouched();
    }
    if (this) {
      this.transformSelectTypedValues();
      this.context.completeWith(this.creationForm.value);
    }
  }

  private transformSelectTypedValues() {
    this.context.data.options
      .filter(option => option.type === 'select')
      .forEach(option => {
        const key = option.key;
        const control =  this.creationForm.controls[key];
        const rawValue = (control.value as SelectOption).value;
        control.setValue(rawValue);
      });
  }

  protected getFormControl(formName: string) {
    return this.creationForm.controls[formName as keyof typeof this.creationForm.controls] as FormControl<any> ;
  }

  protected getError(formControl: FormControl<any>) {
    return AppValidators.getErrorMessage(formControl.errors);
  }

  protected isError(formControl: FormControl<any>) {
    return formControl.invalid && formControl.touched;
  }

  protected onNumericStep(formControl: FormControl<any>, number: number) {
    const value: number = formControl.value;
    formControl.patchValue(value + number);
  }
}
