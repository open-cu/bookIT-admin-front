import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiButton} from '@taiga-ui/core';
import {FilterOptions, FilterResult} from './filter-config';
import {InputContainerComponent} from "../inputs/input-container/input-container.component";
import {Subject, takeUntil} from 'rxjs';

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
export class FilterBlockComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Фильтр';
  @Input() filterText: string = 'Найти';
  @Input({ required: true }) filterOptions!: FilterOptions;

  @Output('onFilterItems')
  onFilterEmitter = new EventEmitter<FilterResult<typeof this.filterOptions>>();

  protected formGroup: FormGroup = new FormGroup({});
  protected isInitialized = false;
  protected processedOptions: FilterOptions = [];

  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.processedOptions = [...this.filterOptions];
    this.createFormGroup();
    this.isInitialized = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFormGroup() {
    this.processedOptions.forEach(option => {
      let defaultValue = option.value ?? null;
      this.formGroup.setControl(option.key, new FormControl(defaultValue));
      if (option.loadOptions) {
        option.loadOptions()
          .pipe(
            takeUntil(this.destroy$)
          )
          .subscribe(options => {
            option.options = options;
            this.cdr.detectChanges();
          });
      }
    });
  }

  protected getFormControl(formName: keyof typeof this.formGroup.controls) {
    return this.formGroup.controls[formName] as FormControl<any>;
  }

  protected onFindButton() {
    this.onFilterEmitter.emit(this.formGroup.value);
  }
}
