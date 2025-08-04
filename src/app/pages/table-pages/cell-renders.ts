import {provideInjectable} from '../../core/providers/injector.provider';
import {DatePipe} from '@angular/common';
import {TypeUtils} from '../../core/utils/type.utils';
import {Image} from '../../core/models/interfaces/images/image';
import {imageToFile} from '../../core/utils/file-format.utils';
import {TableRow} from '../../shared/common-ui/items-table/column-config';
import {random} from 'lodash';
import toArray = TypeUtils.toArray;

export class CellRenders {

  static asDate(format: string = 'short', placeholder: string = '——') {
    return (value: Date | string | number) => {
      const date = provideInjectable(DatePipe).transform(value, format)
      return `<p>${date ?? placeholder}</p>`
    }
  }

  static withStyle(style: string | string[] | Set<string> | undefined) {
    const styles = toArray(style).join(' ');
    return (value: any) => `<p class="${styles}">${value}</p>`
  }

  static asList(separator: string = ',', placeholder: string = '——') {
    return (value: string[]) => {
      const length = value.length;
      if (length === 0) {
        return placeholder;
      }
      let lines = value.map(
        (item: any, i: number) => {
          const sep = (i === length - 1 ? '' : separator);
          return `<p class="cell-line">${item + sep}</p>`;
        }
      );
      return `<div class="cell-lines-container">${lines.join('')}</div>`;
    }
  }

  static asNullish(placeholder: string = '——') {
    return (value: any) => value === null || value === undefined ? placeholder : value;
  }

  static asImages() {
    return (value: Image[] | Image) => {
      const images = toArray(value);
      if (images.length === 0) {
        return '——';
      }
      let lines: string[] = images.map(item => {
        const link = URL.createObjectURL(imageToFile(item));
        return `<a href="${link}">${item.key}</a>`
      });
      return `<div class="cell-lines">${lines.join()}</div>`;
    }
  }

  static asUrlImage(nameKey?: string, prefix?: string) {
    return (value: string | null, _: number, raw: TableRow) => {
      if (value === null) {
        return '——'
      }
      const fileName = nameKey
        ? raw.find(item => item[0] === nameKey)?.at(1)
        : undefined;
      const link = (prefix ?? '') + value;
      const name = fileName ?? random(false);
      return `<a href="${link}">${name}</a>`
    }
  }
}
