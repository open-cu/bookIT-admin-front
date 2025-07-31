import {Component, forwardRef} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiError} from "@taiga-ui/core";
import {
  TuiFieldErrorPipe,
  TuiFile,
  TuiFileRejectedPipe,
  tuiFilesAccepted,
  TuiFilesComponent,
  TuiInputFiles,
  TuiInputFilesDirective
} from "@taiga-ui/kit";
import {InputComponent} from '../input.component';
import {map} from 'rxjs';

@Component({
  selector: 'app-image-input',
    imports: [
        AsyncPipe,
        ReactiveFormsModule,
        TuiError,
        TuiFieldErrorPipe,
        TuiFile,
        TuiFileRejectedPipe,
        TuiFilesComponent,
        TuiInputFiles,
        TuiInputFilesDirective
    ],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageInputComponent),
      multi: true,
    }
  ]
})
export class ImageInputComponent extends InputComponent<File[]>{
  protected readonly accepted$ = this.control.valueChanges.pipe(
    map(() => tuiFilesAccepted(this.control)),
  );

  protected rejected: readonly File[] = [];

  protected onReject(files: readonly File[]): void {
    this.rejected = Array.from(new Set(this.rejected.concat(files)));
  }

  protected onRemove(file: File): void {
    this.rejected = this.rejected.filter((rejected) => rejected !== file);
    this.control.setValue(
      this.control.value?.filter((current) => current !== file) ?? [],
    );
  }
}
