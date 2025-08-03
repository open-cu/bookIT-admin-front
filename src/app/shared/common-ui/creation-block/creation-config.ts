import {ValidatorFn, Validators} from '@angular/forms';
import {TypeUtils} from '../../../core/utils/type.utils';
import toArray = TypeUtils.toArray;
import {InputType} from '../inputs/input-container/input-container.component';
import {Observable} from 'rxjs';

export interface CreationConfig {
  options: CreationOptions,
  title?: string,
  button?: string,
  validators?: ValidatorFn | ValidatorFn[],
}

export type CreationOptions = CreationOption[]

export interface SelectOption {
  value: any
  label?: string
}

export interface CreationOption {
  key: string,
  /* label as same as key by default */
  value?: any,
  loadValue?: () => Observable<any>,
  label?: string,
  placeholder?: string,
  validators?: ValidatorFn | ValidatorFn[],
  /* 'text' by default */
  type?: InputType,
  /* necessary only if type === 'select' */
  options?: SelectOption[],
  /* mark that this option depends on some other (necessary only type === 'select') */
  dependsOn?: string[],
  /* load options when keys from 'dependsOn' changes (necessary only type === 'select') */
  loadOptions?: (values: Record<string, any>) => Observable<SelectOption[]>,
  disabled?: boolean,
}

export type CreationReturn<T extends CreationOptions> = {
  [K in T[number]['key']]: any;
};

export function markAsRequired(config: CreationConfig, excludes?: string[] | string) {
  const excludedList = toArray(excludes);
  config.options
    .filter(option => !excludedList.includes(option.key))
    .forEach(option => {
      let validators = toArray(option.validators);
      const required = Validators.required;
      if (!validators.includes(required)) {
        validators.push(required)
      }
      option.validators = validators;
    });
  return config;
}
