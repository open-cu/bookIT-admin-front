export interface ColumnConfig {
  key: string;
  title?: string;
  render?: (value: any) => any;
  cssClass?: StringOptions | ((value: any) => StringOptions) | null | undefined;
}

export type StringOptions = string | string[] | Set<string> | {[p: string]: any};

export type TableRow = [string, any][];
