import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TuiButton} from '@taiga-ui/core';
import {FilterOptions, FilterResult} from './filter-config';
import {InputContainerComponent} from "../inputs/input-container/input-container.component";

@Component({
  selector: 'app-filter-block',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        InputContainerComponent
    ],
  templateUrl: './filter-block.component.html',
  styleUrl: './filter-block.component.css'
})
export class FilterBlockComponent implements OnInit {
  @Input() title: string = 'Фильтр';
  @Input() filterText: string = 'Найти';
  @Input({required: true}) filterOptions!: FilterOptions;

  @Output('onFilterItems')
  onFilterEmitter = new EventEmitter<FilterResult<typeof this.filterOptions>>();

  protected formGroup!: FormGroup;

  ngOnInit() {
    const formParams = new Map<string, FormControl<any | null>>();
    this.filterOptions
      .forEach(option => {
        let defaultValue = option.value ?? null;
        formParams.set(option.key, new FormControl(defaultValue))
      });
    this.formGroup = new FormGroup(Object.fromEntries(formParams));
  }

  protected getFormControl(formName: keyof typeof this.formGroup.controls) {
    return this.formGroup.controls[formName] as FormControl<any>;
  }

  protected onFindButton() {
    this.onFilterEmitter.emit(this.formGroup.value);
  }
}
