export interface CreationConfig {
  options: CreationOptions,
  title?: string,
  button?: string
}

export type CreationOptions = CreationOption[]

export interface SelectOption {
  value: any
  label?: string
}

export type OptionType = 'text' | 'select' | 'images';

export interface CreationOption {
  key: string,
  /* label as same as key by default */
  value?: any,
  label?: string,
  placeholder?: string,
  /* 'text' by default */
  type?: OptionType,
  /* necessary only if type === 'select' */
  options?: SelectOption[],
}

export type CreationReturn<T extends CreationOptions> = {
  [K in T[number]['key']]: any;
};
