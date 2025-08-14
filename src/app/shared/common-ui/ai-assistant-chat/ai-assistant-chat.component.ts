import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  TuiAlertOptions,
  TuiAlertService,
  TuiError,
  TuiIcon,
  TuiTextfieldComponent,
  TuiTextfieldDirective
} from '@taiga-ui/core';
import {AiService} from '../../../core/services/api/ai.service';
import {TuiSwitch} from '@taiga-ui/kit';
import {EMPTY, mergeAll, Observable, Subject, switchMap} from 'rxjs';
import {UserService} from '../../../core/services/api/auth/user.service';
import {finalize, map} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-ai-assistant-chat',
  imports: [
    ReactiveFormsModule,
    TuiError,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiIcon,
    TuiSwitch,
    FormsModule,
    NgStyle
  ],
  templateUrl: './ai-assistant-chat.component.html',
  styleUrl: './ai-assistant-chat.component.css',
})
export class AiAssistantChatComponent {
  private aiService = inject(AiService);
  private userService = inject(UserService);
  private alertService = inject(TuiAlertService);
  private destroyRef = inject(DestroyRef);

  private readonly alertQueue$ = new Subject<Observable<void>>();
  private readonly requestQueue$ = new Subject<Observable<string>>();

  protected isRequestInProgress = false;
  protected isHumanized = false;
  protected formControl = new FormControl('');

  constructor() {
    this.requestQueue$.pipe(
      mergeAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: request => this.addAlertInQueue(request, 'success'),
      error: error => this.addAlertInQueue(error, 'error'),
    });

    this.alertQueue$.pipe(
      mergeAll(5),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  protected onRequestSend() {
    if (this.isRequestInProgress) {
      return;
    }

    const prompt = this.formControl.getRawValue()?.trim();
    if (!prompt) {
      return;
    }

    this.isRequestInProgress = true;
    this.formControl.reset();

    const request$ = this.createRequest(prompt).pipe(
      finalize(() => this.isRequestInProgress = false),
    );

    this.requestQueue$.next(request$);
  }

  private createRequest(prompt: string): Observable<string> {
    return this.userService.getMe().pipe(
      map(user => user.id),
      switchMap(user_id => this.aiService.makeRequest({ user_id, prompt }, this.isHumanized))
    );
  }

  private showAlert(content: string, type: 'success' | 'error'): Observable<void> {
    const options: Partial<TuiAlertOptions> = {
      autoClose: 0,
      closeable: true,
      appearance: type === 'success' ? 'positive' : 'negative'
    };

    return this.alertService.open(content, options);
  }

  private addAlertInQueue(content: string, type: 'success'): void;
  private addAlertInQueue(content: any, type: 'error'): void;

  private addAlertInQueue(content: string | any, type: 'success' | 'error') {
    let alert$: Observable<void>;
    switch (type) {
      case 'success':
        alert$ = this.showAlert(content as string, type);
        break;
      case 'error':
        alert$ = this.showAlert(`Ошибка: ${content?.message ?? 'unknown error'}`, type);
        break
      default:
        alert$ = EMPTY;
    }

    this.alertQueue$.next(alert$);
  };
}
