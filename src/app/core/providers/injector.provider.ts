import {inject, Injector, ProviderToken, runInInjectionContext} from '@angular/core';

let _appInjector: Injector | null = null;

export function provideAppInjector(injector?: Injector) {
  if (_appInjector) {
    console.warn('AppInjector has been already provided!');
    return _appInjector;
  }
  return _appInjector = (injector ? injector : inject(Injector));
}

export function provideInjectable<T>(token: ProviderToken<T>) {
  if (!_appInjector) {
    throw new Error('AppInjector not initialized!');
  }
  return runInInjectionContext(_appInjector, () => inject(token));
}
