import {Component, inject} from '@angular/core';
import {TuiBlockStatusComponent} from '@taiga-ui/layout';
import {TuiButton} from '@taiga-ui/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [
    TuiBlockStatusComponent,
    TuiButton
  ],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.less'
})
export class NotFoundPageComponent {
  private router = inject(Router);

  protected reloadPage() {
    location.reload();
  }

  protected onMainPage() {
    this.router.navigate(['/']).then();
  }
}
