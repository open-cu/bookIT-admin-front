import {Component, DestroyRef, inject} from '@angular/core';
import {CreationConfig, CreationOptions, SelectOption} from './creation-config';
import {TuiButton, TuiDialogContext, TuiLabel} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TypeUtils} from '../../../core/utils/type.utils';
import {InputContainerComponent} from '../inputs/input-container/input-container.component';
import {combineLatest, filter, map, Observable, of} from 'rxjs';
import {catchError, distinctUntilChanged, finalize, startWith, switchMap, take, tap} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import toArray = TypeUtils.toArray;

type CreationContext = TuiDialogContext<any, CreationConfig>;

@Component({
  selector: 'app-creation-block',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputContainerComponent,
    TuiLabel,
    TuiButton,
  ],
  templateUrl: './creation-block.component.html',
  styleUrls: ['./creation-block.component.css']
})
export class CreationBlockComponent {
  public readonly context = injectContext<CreationContext>();
  protected creationForm!: FormGroup;
  protected currentOptions: CreationOptions;
  protected loadingStates: Record<string, boolean> = {};

  private destroyRef = inject(DestroyRef);

  constructor() {
    this.currentOptions = [...this.context.data.options];
    this.initForm();
    this.setupOptionsLoading();
    this.loadInitialValues();
  }

  private initForm() {
    const formGroupConfig: Record<string, FormControl> = {};

    for (const configItem of this.currentOptions) {
      const initialValue = configItem.loadValue ? null : configItem.value ?? null;
      formGroupConfig[configItem.key] = new FormControl(
        initialValue,
        toArray(configItem.validators)
      );
    }

    this.creationForm = new FormGroup(
      formGroupConfig,
      toArray(this.context.data.validators)
    );
  }

  private setupOptionsLoading() {
    for (const configItem of this.currentOptions) {
      if (!configItem.loadOptions) continue;

      const { key, dependsOn: dependencies = [] } = configItem;
      const dependencyKeys = dependencies.filter(dep =>
        this.creationForm.get(dep) !== null
      );

      if (dependencyKeys.length === 0) {
        this.loadFieldOptionsOnce(key, configItem.loadOptions);
        continue;
      }

      const dependencyStreams = dependencyKeys.map(depKey =>
        this.creationForm.get(depKey)!.valueChanges.pipe(
          startWith(this.creationForm.get(depKey)!.value),
          distinctUntilChanged()
        )
      );

      combineLatest(dependencyStreams).pipe(
        map(values => {
          const dependencyValues = Object.fromEntries(
            dependencyKeys.map((key, i) => [key, values[i]])
          );
          return {
            values: dependencyValues,
            allValid: dependencyKeys.every(key => dependencyValues[key] != null)
          };
        }),
        tap(({ allValid }) => !allValid && this.updateFieldOptions(key, [])),
        filter(({ allValid }) => allValid),
        tap(() => this.loadingStates[key] = true),
        switchMap(({ values }) => configItem.loadOptions!(values).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingStates[key] = false)
        )),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(options => this.updateFieldOptions(key, options));
    }
  }

  private loadFieldOptionsOnce(key: string, loader: (values: Record<string, any>) => Observable<SelectOption[]>) {
    this.loadingStates[key] = true;

    loader({}).pipe(
      take(1),
      catchError(() => of([])),
      finalize(() => this.loadingStates[key] = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(options => {
      this.updateFieldOptions(key, options);
      const value = this.context.data.options
        .find(option => option.key === key)
        ?.value ?? null;
      setTimeout(() => this.getFormControl(key).setValue(value), 1);
    });
  }

  private loadInitialValues() {
    for (const configItem of this.currentOptions) {
      if (!configItem.loadValue) {
        continue;
      }

      const { key } = configItem;
      this.loadingStates[key] = true;

      configItem.loadValue!().pipe(
        take(1),
        catchError(() => of(null)),
        finalize(() => this.loadingStates[key] = false)
      ).subscribe(value => {
        const control = this.creationForm.get(key);
        control?.setValue(value);
      });
    }
  }

  private updateFieldOptions(fieldKey: string, newOptions: SelectOption[]) {
    const index = this.currentOptions.findIndex(opt => opt.key === fieldKey);
    if (index === -1) {
      return;
    }

    if (JSON.stringify(this.currentOptions[index].options) === JSON.stringify(newOptions)) {
      return;
    }

    this.currentOptions[index] = { ...this.currentOptions[index], options: newOptions };

    const control = this.creationForm.get(fieldKey);
    if (control) {
      const currentValue = control.value;
      const isValidValue = newOptions.some(opt => opt.value === currentValue);

      if (!isValidValue) {
        control.reset(null);
      }
      control.updateValueAndValidity();
    }
  }

  protected onSubmit() {
    if (this.creationForm.invalid) {
      this.creationForm.markAllAsTouched();
      return;
    }
    this.context.completeWith(this.creationForm.value);
  }

  protected getFormControl(formName: string): FormControl {
    return this.creationForm.get(formName) as FormControl;
  }
}
