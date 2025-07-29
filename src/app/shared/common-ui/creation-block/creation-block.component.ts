import {Component} from '@angular/core';
import {CreationConfig, CreationOptions, CreationReturn, OptionType} from './creation-config';
import {TuiButton, TuiDialogContext, TuiLabel} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TypeUtils} from '../../../core/utils/type.utils';
import toArray = TypeUtils.toArray;
import {SingleSelectInputComponent} from '../inputs/single-select-input/single-select-input.component';
import {ChipInputComponent} from '../inputs/chip-input/chip-input.component';
import {NumberInputComponent} from '../inputs/number-input/number-input.component';
import {FileInputComponent} from '../inputs/file-input/file-input.component';
import {TextInputComponent} from '../inputs/text-input/text-input.component';

type CreationContext = TuiDialogContext<CreationReturn<CreationOptions>, CreationConfig>

@Component({
  selector: 'app-creation-block',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    FormsModule,
    TuiLabel,
    SingleSelectInputComponent,
    ChipInputComponent,
    NumberInputComponent,
    FileInputComponent,
    TextInputComponent,
  ],
  templateUrl: './creation-block.component.html',
  styleUrl: './creation-block.component.css'
})
export class CreationBlockComponent {
  public readonly context = injectContext<CreationContext>();
  protected creationForm!: FormGroup;

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
      case 'images':
        return new Array<File>();
      default:
        return '';
    }
  }

  protected onSubmit() {
    if (this.creationForm.invalid) {
      this.creationForm.markAllAsTouched();
    }
    if (this) {
      this.context.completeWith(this.creationForm.value);
    }
  }

  protected getFormControl(formName: keyof typeof this.creationForm.controls) {
    return this.creationForm.controls[formName] as FormControl<any>;
  }
}
