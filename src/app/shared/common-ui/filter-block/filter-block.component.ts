import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiButton} from '@taiga-ui/core';
import {FilterOptions, FilterResult} from './filter-config';
import {InputContainerComponent} from "../inputs/input-container/input-container.component";

@Component({
  selector: 'app-filter-block',
    imports: [
        FormsModule,
        TuiButton,
        ReactiveFormsModule,
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

  protected formGroup: FormGroup = new FormGroup({});
  protected isInitialized = false;

  ngOnInit() {
    this.createFormGroup();
    this.isInitialized = true;
  }

  private createFormGroup() {
    this.filterOptions.forEach(option => {
      let defaultValue = option.value ?? null;
      this.formGroup.setControl(option.key, new FormControl(defaultValue));
    });
  }

  protected getFormControl(formName: keyof typeof this.formGroup.controls) {
    return this.formGroup.controls[formName] as FormControl<any>;
  }

  protected onFindButton() {
    this.onFilterEmitter.emit(this.formGroup.value);
  }
}
