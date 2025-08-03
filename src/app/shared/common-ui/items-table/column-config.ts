export interface ColumnConfig {
  key: string;
  title?: string;
  render?: (value: any, index: number, raw: TableRow) => any;
  cssClass?: StringOptions | ((value: any) => StringOptions) | null | undefined;
  disabled?: boolean;
}

export type StringOptions = string | string[] | Set<string> | {[p: string]: any};

export type TableRow = [string, any][];
