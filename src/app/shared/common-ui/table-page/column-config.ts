export interface ColumnConfig {
  key: string;
  title?: string;
  render?: (value: any, row: TableRow) => any;
  cssClass?: StringOptions | ((value: any, row: TableRow) => StringOptions) | null | undefined;
}

export type StringOptions = string | string[] | Set<string> | {[p: string]: any};

export type TableRow = [string, any][];
