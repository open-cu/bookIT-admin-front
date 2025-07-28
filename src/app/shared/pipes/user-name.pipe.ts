import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class UserNamePipe implements PipeTransform {
  transform(user: {firstName?: string, lastName?: string} | undefined | null): string | null {
    if (!user) {
      return null
    }
    let source: (string | undefined)[] = [user.firstName, user.lastName];
    const result = source.filter(str => str && str.length > 0).join(' ');
    return result.length > 0 ? result : null;
  }
}
