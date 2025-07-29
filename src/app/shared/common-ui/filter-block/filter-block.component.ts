import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core';
import {FilterOptions, FilterResult, FilterType} from './filter-config';

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
  @Input({required: true}) filterOptions!: FilterOptions;

  @Output('onFilter')
  onFilterEmitter = new EventEmitter<FilterResult<typeof this.filterOptions>>();

  protected formGroup!: FormGroup;

  ngOnInit() {
    const formParams = new Map<string, FormControl<string | null>>();
    this.filterOptions
      .forEach(option => {
        let defaultValue = option.value ?? this.getDefaultValue(option.type);
        formParams.set(option.key, new FormControl(defaultValue))
      });
    this.formGroup = new FormGroup(Object.fromEntries(formParams));
  }

  private getDefaultValue(type: FilterType | undefined): string | null {
    if (!type || type === 'text') {
      return '';
    }
    if (type === 'date-range') {
      return null;
    }
    return null;
  }

  protected getControl(formName: keyof typeof this.formGroup.controls) {
    return this.formGroup.controls[formName] as FormControl<string>;
  }

  protected onFindButton() {
    this.onFilterEmitter.emit(this.formGroup.value);
  }
}
