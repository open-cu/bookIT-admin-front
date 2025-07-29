import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TuiError} from "@taiga-ui/core";
import {
  TuiFieldErrorPipe,
  TuiFile,
  TuiFileRejectedPipe, tuiFilesAccepted,
  TuiFilesComponent,
  TuiInputFiles,
  TuiInputFilesDirective
} from "@taiga-ui/kit";
import {InputComponent} from '../input.component';
import {map} from 'rxjs';

@Component({
  selector: 'app-file-input',
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
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent extends InputComponent<File[]>{
  protected readonly accepted$ = this.formControl.valueChanges.pipe(
    map(() => tuiFilesAccepted(this.formControl)),
  );

  protected rejected: readonly File[] = [];

  protected onReject(files: readonly File[]): void {
    this.rejected = Array.from(new Set(this.rejected.concat(files)));
  }

  protected onRemove(file: File): void {
    this.rejected = this.rejected.filter((rejected) => rejected !== file);
    this.formControl.setValue(
      this.formControl.value?.filter((current) => current !== file) ?? [],
    );
  }
}
