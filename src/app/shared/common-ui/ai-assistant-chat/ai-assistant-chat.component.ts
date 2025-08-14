import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiAlertService, TuiError, TuiIcon, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core';
import {AiService} from '../../../core/services/api/ai.service';
import {TuiSwitch} from '@taiga-ui/kit';
import {EMPTY, mergeAll, Observable, Subject, switchMap, tap} from 'rxjs';
import {UserService} from '../../../core/services/api/auth/user.service';
import {map} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ai-assistant-chat',
  imports: [
    ReactiveFormsModule,
    TuiError,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiIcon,
    TuiSwitch,
    FormsModule
  ],
  templateUrl: './ai-assistant-chat.component.html',
  styleUrl: './ai-assistant-chat.component.css',
})
export class AiAssistantChatComponent {
  private aiService = inject(AiService);
  private userService = inject(UserService);
  private alertService = inject(TuiAlertService);
  private destroyRef = inject(DestroyRef);

  private readonly maxConcurrent = 5;
  private readonly queue$ = new Subject<Observable<void>>();

  protected isHumanized = false;
  protected formControl = new FormControl('');

  constructor() {
    this.queue$.pipe(
      mergeAll(this.maxConcurrent),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  protected makeRequest() {
    const prompt = this.formControl.getRawValue();

    if (!prompt || prompt === '') {
      return EMPTY;
    }

    return this.userService.getMe().pipe(
      map(user => user.id),
      tap(() => this.formControl.setValue(null)),
      switchMap(user_id => this.aiService.makeRequest({ user_id, prompt }, this.isHumanized))
    );
  }

  protected onRequestSend() {
    this.queue$.next(
      this.makeRequest().pipe(
        switchMap(result => this.alertService.open(result, {autoClose: 0}))
      )
    );
  }
}
