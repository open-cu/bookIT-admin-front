import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  TuiAlertService,
  TuiButton,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective
} from '@taiga-ui/core';
import {AppValidators} from '../../shared/validators/app.validators';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/api/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    TuiTextfieldDirective,
    TuiTextfieldComponent,
    FormsModule,
    TuiLabel,
    TuiButton,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  protected authForm = new FormGroup({
    telegram: new FormControl('', AppValidators.telegram),
    firstName: new FormControl('', AppValidators.name(true)),
    lastName: new FormControl('', AppValidators.name(false)),
  });

  protected placeholders: Record<keyof typeof this.authForm.value, string> = {
    telegram: '@username',
    firstName: 'Введите имя',
    lastName: 'Введите фамилию',
  }

  private router = inject(Router);
  private authService = inject(AuthService);
  private alertService = inject(TuiAlertService);

  protected formatTelegram(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value && !value.startsWith('@')) {
      value = '@' + value;
      input.value = value;
      this.authForm.patchValue({ telegram: value });
    }
  }

  protected getErrorMessage(formName: keyof typeof this.authForm.controls) {
    return AppValidators.getErrorMessage(this.authForm.controls[formName].errors)
  }

  protected isInvalidForm(formName: keyof typeof this.authForm.controls) {
    const formControl = this.authForm.controls[formName];
    return !formControl || formControl.invalid && formControl.touched;
  }

  protected getControls() {
    return Object.entries(this.authForm.controls) as [keyof typeof this.authForm.controls,  FormControl<string | null>][];
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const formData = this.authForm.value;
    this.authService.authorize({
      id: 0,
      first_name: formData.firstName!,
      last_name: formData.lastName ?? undefined,
    }).subscribe({
      next: () => {
        this.authService.complete({
          firstName: 'Some',
          lastName: 'User',
          email: 'email@gmail.com',
          phone: '+78115678945'
        }).subscribe();
        this.router.navigate(['/']).then();
      },
      error: () => this.alertService.open(
        'Произошла ошибка. Повторите попытку позже.',
        {
          appearance: 'action-destructive',
          autoClose: 2000,
        }
      )
    });
  }
}
