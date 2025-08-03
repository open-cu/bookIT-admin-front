import {Routes} from '@angular/router';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {APP_ROUTES} from './app.routes.paths';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {TicketsPageComponent} from './pages/table-pages/tickets-page/tickets-page.component';
import {AreasPageComponent} from './pages/table-pages/areas-page/areas-page.component';
import {USER_DATA, userResolver} from './core/resolvers/user-resolver';
import {BookingsPageComponent} from './pages/table-pages/bookings-page/bookings-page.component';
import {UsersPageComponent} from './pages/table-pages/users-page/users-page.component';
import {AdminsPageComponent} from './pages/table-pages/admins-page/admins-page.component';

export const routes: Routes = [
  {path: APP_ROUTES.LOGIN, component: LoginPageComponent},
  {
    path: '',
    component: MainLayoutComponent,
    resolve: { [USER_DATA]: userResolver },
    children: [
      {path: '', redirectTo: APP_ROUTES.TICKETS, pathMatch: 'full'},
      {path: APP_ROUTES.TICKETS, component: TicketsPageComponent},
      {path: APP_ROUTES.AREAS, component: AreasPageComponent},
      {path: APP_ROUTES.BOOKINGS, component: BookingsPageComponent},
      {path: APP_ROUTES.USERS, component: UsersPageComponent},

      {path: APP_ROUTES.ADMINS, component: AdminsPageComponent},
    ]
  },
  {path: '**', component: NotFoundPageComponent}
];
