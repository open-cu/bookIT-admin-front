import {Component, Input} from '@angular/core';
import {CreationConfig} from '../creation-block/creation-config';
import {TuiButton, tuiDialog} from '@taiga-ui/core';
import {CreationBlockComponent} from '../creation-block/creation-block.component';
import {EMPTY, Observable, switchMap} from 'rxjs';
import {ColumnConfig} from '../items-table/column-config';
import {ItemsTableComponent} from '../items-table/items-table.component';
import {FilterBlockComponent} from '../filter-block/filter-block.component';
import {DeletionBlockComponent} from '../deletion-block/deletion-block.component';
import {DeletionConfig} from '../deletion-block/deletion-config';
import {FilterOptions, FilterResult} from '../filter-block/filter-config';

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
export class TablePageComponent<T extends object> extends ItemsTableComponent<T> {
  @Input('createFn') createItemFn: (item: any) => Observable<Partial<T>> = () => EMPTY;
  @Input('editFn') editItemFn: (id: string, item: any) => Observable<Partial<T>> = () => EMPTY;
  @Input('deleteFn') deleteItemFn: (item: any) => Observable<void> = () => EMPTY;

  @Input() title: string = '';
  @Input() filterButton: string = 'Найти';
  @Input() filterTitle: string = 'Поиск';

  @Input() filterOptions!: FilterOptions;

  @Input() columns!: ColumnConfig[];

  @Input() creationConfig!: CreationConfig;
  @Input() editionConfig!: CreationConfig;
  @Input() deletionConfig!: DeletionConfig;
  @Input() canCreate = true;

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
  protected filterResult!: FilterResult<typeof this.filterOptions>;

  protected onCreateNewItem() {
    this.creationDialog(this.creationConfig)
      .pipe(
        switchMap(item => item ? this.createItemFn(item) : EMPTY)
      )
      .subscribe(() => this.updateItems());
  }

  protected onEditItem(item: any) {
    this.editionDialog(this.editionConfig)
      .pipe(
        switchMap(value => value ? this.editItemFn(item.id, value) : EMPTY)
      )
      .subscribe(() => this.updateItems());
  }

  protected onDeleteItem(item: any) {
    this.deletionDialog(this.deletionConfig)
      .pipe(
        switchMap(result => result ? this.deleteItemFn(item) : EMPTY)
      )
      .subscribe(() => this.updateItems());
  }
}
