import { Routes } from '@angular/router';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {APP_ROUTES} from './app.routes.paths';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {TicketsPageComponent} from './pages/tickets-page/tickets-page.component';

export const routes: Routes = [
  {path: APP_ROUTES.LOGIN, component: LoginPageComponent},
  {path: '', component: MainLayoutComponent,
    children: [
      {path: APP_ROUTES.TICKETS, component: TicketsPageComponent},
    ]
  },
  {path: '**', component: NotFoundPageComponent}
];
