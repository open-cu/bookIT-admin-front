import {inject, Pipe, PipeTransform} from '@angular/core';
import {map, Observable} from 'rxjs';
import {LocalizationService} from '../../core/services/localization.service';

@Pipe({
  name: 'local'
})
export class LocalizePipe implements PipeTransform {
  private localizationService = inject(LocalizationService);

  transform(value: string, args: string[] | string): Observable<string | undefined> {
    return this.localizationService.getMapping([...args, value]).pipe(
      map(value => typeof value === 'object' ? undefined : value),
    );
  }

}
