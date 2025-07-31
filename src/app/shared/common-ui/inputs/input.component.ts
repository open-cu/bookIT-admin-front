import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  ValidationErrors,
  AbstractControl,
  Validator
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppValidators } from '../../validators/app.validators';

@Component({
  selector: 'app-filter-block',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    }
  ]
})
export abstract class InputComponent<T> implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @Input() externalControl?: FormControl<T | null>;
  @Input() useConversion: boolean = true;
  @Input() placeholder: string = '';

  protected internalControl = new FormControl<T | null>(null);
  protected destroy$ = new Subject<void>();
  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => void = () => {};

  ngOnInit() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const externalValue = this.useConversion
          ? this.convertToExternalValue(value)
          : value;
        this.onChange(externalValue);
        this.onTouched();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected get control(): FormControl<T | null> {
    return this.externalControl ?? this.internalControl;
  }

  protected get errorMessage() {
    return this.isInvalid
      ? AppValidators.getErrorMessage(this.control.errors)
      : null;
  }

  protected get isValid() {
    return this.control.untouched || this.control.valid;
  }

  protected get isInvalid() {
    return !this.isValid;
  }

  protected convertToExternalValue(internalValue: T | null): any {
    return internalValue;
  }

  protected convertToInternalValue(externalValue: any): T | null {
    return externalValue;
  }

  writeValue(value: any): void {
    const internalValue = this.useConversion
      ? this.convertToInternalValue(value)
      : value;
    this.control.setValue(internalValue, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.control.errors;
  }
}
