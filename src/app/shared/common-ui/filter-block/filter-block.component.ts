import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core';

type recordLike = {[key: string]: string | undefined};

@Component({
  selector: 'app-filter-block',
  imports: [
    ReactiveFormsModule,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiButton
  ],
  templateUrl: './filter-block.component.html',
  styleUrl: './filter-block.component.css'
})
export class FilterBlockComponent implements OnInit {
  @Input() title: string = 'Фильтр';
  @Input() filterText: string = 'Найти';
  @Input({required: true}) fields!: recordLike;
  @Output('onFilter') onFilterEmitter = new EventEmitter<recordLike>();

  protected formGroup!: FormGroup;

  ngOnInit() {
    const formParams = new Map<string, FormControl<string | null>>();
    Object.entries(this.fields)
      .forEach(([key, _]) => formParams.set(key, new FormControl('')));
    this.formGroup = new FormGroup(Object.fromEntries(formParams));
  }

  protected getEntries() {
    return Object.entries(this.fields);
  }

  protected onFindButton() {
    this.onFilterEmitter.emit(this.formGroup.value);
  }
}
