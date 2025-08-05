import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'name'
})
export class UserNamePipe implements PipeTransform {
  transform(user: {firstName?: string | null, lastName?: string | null} | undefined | null): string | null {
    if (!user) {
      return null
    }
    let source: (string | undefined | null)[] = [user.firstName, user.lastName];
    const result = source.filter(str => str && str.length > 0).join(' ');
    return result.length > 0 ? result : null;
  }
}
