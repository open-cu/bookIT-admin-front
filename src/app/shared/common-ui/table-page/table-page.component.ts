import {Component, inject, Input, OnInit} from '@angular/core';
import {CreationConfig, SelectOption} from '../creation-block/creation-config';
import {TuiButton, tuiDialog} from '@taiga-ui/core';
import {CreationBlockComponent} from '../creation-block/creation-block.component';
import {EMPTY, Observable, switchMap} from 'rxjs';
import {ColumnConfig} from '../items-table/column-config';
import {ItemsTableComponent} from '../items-table/items-table.component';
import {FilterBlockComponent} from '../filter-block/filter-block.component';
import {DeletionBlockComponent} from '../deletion-block/deletion-block.component';
import {DeletionConfig} from '../deletion-block/deletion-config';
import {FilterOptions, FilterResult} from '../filter-block/filter-config';
import {TypeUtils} from '../../../core/utils/type.utils';
import compactObject = TypeUtils.compactObject;
import {TuiDayRange} from '@taiga-ui/cdk';
import {DatePipe} from '@angular/common';
import transformParam = TypeUtils.transformParam;
import getSelf = TypeUtils.getSelf;

@Component({
  selector: 'app-table-page',
  imports: [
    FilterBlockComponent,
    ItemsTableComponent,
    TuiButton
  ],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css'
})
export class TablePageComponent<T extends object> extends ItemsTableComponent<T> implements OnInit {
  @Input('createFn') createItemFn: (item: any) => Observable<Partial<T>> = () => EMPTY;
  @Input('editFn') editItemFn: (id: string, item: any) => Observable<Partial<T>> = () => EMPTY;
  @Input('deleteFn') deleteItemFn: (item: any) => Observable<void> = () => EMPTY;
  @Input() transformParamsFn: (params: any) => any = getSelf;

  @Input() title: string = '';
  @Input() filterButton: string = 'Найти';
  @Input() filterTitle: string = 'Поиск';

  @Input() filterOptions!: FilterOptions;

  @Input() columns!: ColumnConfig[];

  @Input() creationConfig!: CreationConfig;
  @Input() editionConfig!: CreationConfig;
  @Input() deletionConfig!: DeletionConfig;
  @Input() canCreate = true;

  protected filterResult: FilterResult<typeof this.filterOptions> = {};

  private readonly creationDialog = tuiDialog(CreationBlockComponent, {
    dismissible: true,
  });
  private readonly editionDialog = tuiDialog(CreationBlockComponent, {
    dismissible: true,
  });
  private readonly deletionDialog = tuiDialog(DeletionBlockComponent, {
    dismissible: true,
  });

  protected isFilterOpened = false;
  protected transformRequestFn!: typeof this.loadItemsFn;
  private transformWithCompactFn!: typeof this.transformParamsFn;

  private dataPipe = inject(DatePipe);

  ngOnInit() {
    this.transformWithCompactFn = (params: any) => compactObject(this.transformParamsFn(params));
    this.transformRequestFn = transformParam(this.loadItemsFn, this.transformWithCompactFn);
  }

  protected onCreateNewItem() {
    this.creationDialog(this.creationConfig)
      .pipe(
        switchMap(item => item
          ? transformParam(this.createItemFn, this.transformWithCompactFn)(item)
          : EMPTY
        )
      )
      .subscribe(() => this.updateItems());
  }

  protected onEditItem(item: any) {
    this.editionDialog(this.editionConfig)
      .pipe(
        switchMap(value => value
          ? transformParam(this.editItemFn, this.transformWithCompactFn)(item.id, value)
          : EMPTY
        )
      )
      .subscribe(() => this.updateItems());
  }

  protected onDeleteItem(item: any) {
    this.deletionDialog(this.deletionConfig)
      .pipe(
        switchMap(result => result
          ? transformParam(this.deleteItemFn, this.transformWithCompactFn)(item)
          : EMPTY
        )
      )
      .subscribe(() => this.updateItems());
  }

  protected onUpdateFilters(filters: typeof this.filterResult) {
    this.filterResult = compactObject(filters);
  }

  protected extractFromSelect(selected: SelectOption | undefined) {
    if (!selected) {
      return undefined;
    }
    return selected.value;
  }

  protected extractFromDayRange(dayRange: TuiDayRange | undefined) {
    if (!dayRange) {
      return undefined;
    }
    const [startDate, endDate] = dayRange
      .toArray()
      .map(date => this.dataPipe.transform(date.toLocalNativeDate(), 'y-MM-dd'))
    return {startDate, endDate};
  }
}
