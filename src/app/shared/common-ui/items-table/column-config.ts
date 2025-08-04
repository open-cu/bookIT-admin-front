export interface ColumnConfig {
  key: string;
  title?: string;
  render?: (value: any, index: number, raw: TableRow) => any;
  cssClass?: StringOptions | ((value: any) => StringOptions) | null | undefined;
  disabled?: boolean;
}

export type StringOptions = string | string[] | Set<string> | {[p: string]: any};

export type TableRow = [string, any][];

export function mergeColumns(
  keys: string[],
  titles: (string | undefined)[] = [],
  render: (value: any[], index: number, raw: TableRow) => any
) {
  let result: ColumnConfig[] = [];
  result.push({
    key: keys[0],
    title: titles[0],
    render: (_, index, raw) => {
      let values: any[] = new Array(keys.length)
        .map((_, i) => raw[index + i][1]);
      return render(values, index, raw);
    },
  });
  keys.splice(1).forEach((key, i) => {
    result.push({
      key: key,
      title: titles[i],
      disabled: true,
    })
  });
  return result;
}
