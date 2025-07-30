import {Component} from '@angular/core';
import {CreationConfig, CreationOptions, CreationReturn} from './creation-config';
import {TuiButton, TuiDialogContext, TuiLabel} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TypeUtils} from '../../../core/utils/type.utils';
import toArray = TypeUtils.toArray;
import {InputContainerComponent} from '../inputs/input-container/input-container.component';

type CreationContext = TuiDialogContext<CreationReturn<CreationOptions>, CreationConfig>

@Component({
  selector: 'app-creation-block',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    FormsModule,
    TuiLabel,
    InputContainerComponent,
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
      const initialValue = configItem.value ?? null;
      formGroupConfig[configItem.key] = new FormControl(initialValue, toArray(configItem.validators));
    }

    this.creationForm = new FormGroup(formGroupConfig);
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
