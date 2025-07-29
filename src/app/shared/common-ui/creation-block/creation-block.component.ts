import {Component} from '@angular/core';
import {CreationConfig, CreationOptions, CreationReturn, SelectOption} from './creation-config';
import {
  TuiButton,
  TuiDialogContext, TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective, TuiTextfieldDropdownDirective
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiChevron, TuiDataListWrapperComponent, TuiSelectDirective} from '@taiga-ui/kit';
import {TuiIdentityMatcher, TuiStringHandler} from '@taiga-ui/cdk';

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
    TuiLabel
  ],
  templateUrl: './creation-block.component.html',
  styleUrl: './creation-block.component.css'
})
export class CreationBlockComponent {
  public readonly context = injectContext<CreationContext>();
  protected stringify: TuiStringHandler<SelectOption> = option => option.label ?? option.value;
  protected matcher: TuiIdentityMatcher<SelectOption> = (a, b) => a.value === b.value;
  protected creationForm!: FormGroup;

  constructor() {
    this.initFormGroup();
  }

  private initFormGroup() {
    const formGroupConfig: Record<string, FormControl> = {};


    for (const configItem of this.context.data.options) {
      const initialValue = configItem.value
        ? configItem.value
        : configItem.type === 'select' ? undefined : '';
      formGroupConfig[configItem.key] = new FormControl(initialValue, Validators.required);
    }

    this.creationForm = new FormGroup(formGroupConfig);
  }

  protected onSubmit() {
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
}
