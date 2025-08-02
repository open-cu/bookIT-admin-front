import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CreationConfig, CreationOptions, CreationReturn, SelectOption} from './creation-config';
import {TuiButton, TuiDialogContext, TuiLabel} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TypeUtils} from '../../../core/utils/type.utils';
import toArray = TypeUtils.toArray;
import {InputContainerComponent} from '../inputs/input-container/input-container.component';
import {
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap, take
} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
export class CreationBlockComponent implements OnInit {
  public readonly context = injectContext<CreationContext>();
  protected creationForm!: FormGroup;

  protected currentOptions: CreationOptions;
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.currentOptions = this.context.data.options.map(opt => ({ ...opt }));
    this.initFormGroup();
    this.setupDynamicDependencies();
  }

  ngOnInit() {
    this.currentOptions
      .filter(opt => opt.loadOptions && (!opt.dependsOn || opt.dependsOn.length === 0))
      .forEach(configItem => {
        configItem.loadOptions!({})
          .pipe(take(1), catchError(() => of([])))
          .subscribe(options => {
            this.updateFieldOptions(configItem.key, options);
          });
      });
  }

  private initFormGroup() {
    this.currentOptions = this.context.data.options.map(opt => ({ ...opt }));

    const formGroupConfig: Record<string, FormControl> = {};
    this.currentOptions.forEach(configItem => {
      formGroupConfig[configItem.key] = new FormControl(
        configItem.value ?? null,
        toArray(configItem.validators)
      );
    });

    this.creationForm = new FormGroup(formGroupConfig, this.context.data.validators);
  }

  private setupDynamicDependencies() {
    this.currentOptions
      .filter(opt => opt.loadOptions)
      .forEach(configItem => {
        const dependencies = configItem.dependsOn || [];
        const dependentControls = dependencies
          .map(key => this.creationForm.get(key))
          .filter(Boolean) as FormControl[];

        let baseStream: Observable<any>;

        if (dependentControls.length > 0) {
          baseStream = combineLatest(
            dependentControls.map(control =>
              control.valueChanges.pipe(
                startWith(control.value),
                distinctUntilChanged()
              )
            )
          ).pipe(
            debounceTime(300),
            map(values => dependencies.reduce((acc, key, i) => {
              acc[key] = values[i];
              return acc;
            }, {} as Record<string, any>))
          );
        } else {
          baseStream = of({}).pipe(delay(0));
        }

        /* TODO: hide all exceptions or configure field updates */
        baseStream.pipe(
          switchMap(values => configItem.loadOptions!(values)),
          takeUntilDestroyed(this.destroyRef),
          catchError(() => of([])),
        ).subscribe(
          newOptions => this.updateFieldOptions(configItem.key, newOptions)
        );
      });
  }

  private updateFieldOptions(fieldKey: string, newOptions: SelectOption[]) {
    const index = this.currentOptions.findIndex(opt => opt.key === fieldKey);

    if (index > -1) {
      this.currentOptions = [
        ...this.currentOptions.slice(0, index),
        { ...this.currentOptions[index], options: newOptions },
        ...this.currentOptions.slice(index + 1)
      ];

      const control = this.creationForm.get(fieldKey);
      control?.reset(null);
      control?.updateValueAndValidity();
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
