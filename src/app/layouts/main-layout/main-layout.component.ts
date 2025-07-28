import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {TuiAsideComponent, tuiLayoutIconsProvider, TuiNavigation} from '@taiga-ui/layout';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {APP_ROUTES} from '../../app.routes.paths';
import {UserService} from '../../core/services/api/auth/user.service';
import {UserNamePipe} from '../../shared/pipes/user-name.pipe';
import {Observable} from 'rxjs';
import {User} from '../../core/models/interfaces/users/user';
import {AsyncPipe} from '@angular/common';
import {AuthService} from '../../core/services/api/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    TuiNavigation,
    TuiIcon,
    TuiAvatar,
    RouterLink,
    TuiAsideComponent,
    TuiButton,
    UserNamePipe,
    AsyncPipe,
  ],
  providers: [
    tuiLayoutIconsProvider({grid: '@tui.align-justify'}),
    TuiAsideComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  protected readonly NAVIGATION_BUTTONS: {path: string, name: string, icon: string}[] = [
    {
      path: APP_ROUTES.TICKETS,
      name: 'Тикеты',
      icon: '@tui.pencil'
    },
    {
      path: APP_ROUTES.AREAS,
      name: 'Помещения',
      icon: '@tui.laptop-minimal'
    },
    {
      path: APP_ROUTES.BOOKINGS,
      name: 'Бронирования',
      icon: '@tui.clock'
    },
    {
      path: APP_ROUTES.USERS,
      name: 'Пользователи',
      icon: '@tui.users'
    },
    {
      path: APP_ROUTES.EVENTS,
      name: 'Мероприятия',
      icon: '@tui.calendar'
    },
    {
      path: APP_ROUTES.NEWS,
      name: 'Новости',
      icon: '@tui.newspaper'
    },
    {
      path: APP_ROUTES.STATS,
      name: 'Статистика',
      icon: '@tui.chart-column-increasing'
    },
    {
      path: APP_ROUTES.RATINGS,
      name: 'Оценки',
      icon: '@tui.star'
    },
    {
      path: APP_ROUTES.ADMINS,
      name: 'Администраторы',
      icon: '@tui.user-round-cog'
    },
  ] as const;

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected me$: Observable<User>;

  constructor() {
    this.me$ = this.userService.getMe();
  }

  protected onLogoutClick() {
    this.authService.logout();
    return this.router.navigate(['/', APP_ROUTES.LOGIN]);
  }
}
