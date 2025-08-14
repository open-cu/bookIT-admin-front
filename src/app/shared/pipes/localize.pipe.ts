import {inject, Pipe, PipeTransform} from '@angular/core';
import {map, Observable} from 'rxjs';
import {LocalizationService} from '../../core/services/localization.service';
import {TypeUtils} from '../../core/utils/type.utils';
import toArray = TypeUtils.toArray;

@Pipe({
  name: 'local'
})
export class LocalizePipe implements PipeTransform {
  private localizationService = inject(LocalizationService);

  transform(value: string | undefined, args?: string[] | string | undefined | null): Observable<string> {
    const rawMapping = toArray(args);
    const mapping = value ? [...rawMapping, value] : [...rawMapping];
    return this.localizationService.getMapping(mapping).pipe(
      map(item => typeof item === 'object' || typeof item === 'undefined' ? (value ?? '') : item),
    );
  }
}
