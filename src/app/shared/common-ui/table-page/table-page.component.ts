import {Component, inject, Input, OnInit} from '@angular/core';
import {CreationConfig} from '../creation-block/creation-config';
import {TuiButton, tuiDialog} from '@taiga-ui/core';
import {CreationBlockComponent} from '../creation-block/creation-block.component';
import {EMPTY, Observable, switchMap} from 'rxjs';
import {ColumnConfig} from '../items-table/column-config';
import {ItemsTableComponent} from '../items-table/items-table.component';
import {FilterBlockComponent} from '../filter-block/filter-block.component';
import {DeletionConfig} from './deletion-config';
import {FilterOptions, FilterResult} from '../filter-block/filter-config';
import {TypeUtils} from '../../../core/utils/type.utils';
import compactObject = TypeUtils.compactObject;
import transformParam = TypeUtils.transformParam;
import getSelf = TypeUtils.getSelf;
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {TUI_CONFIRM} from '@taiga-ui/kit';

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
  @Input('editFn') editItemFn: (item: any, patch: any) => Observable<Partial<T>> = () => EMPTY;
  @Input('deleteFn') deleteItemFn: (item: any) => Observable<string> = () => EMPTY;
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
  private dialogService = inject(TuiResponsiveDialogService);

  protected isFilterOpened = false;
  protected transformRequestFn!: typeof this.loadItemsFn;
  private transformWithCompactFn!: typeof this.transformParamsFn;

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

  protected onEditItem(tableRaw: any) {
    const item = Object.fromEntries(tableRaw);
    const config = this.patchConfigWithItem(this.editionConfig, item);
    console.log(config);
    this.editionDialog(config)
      .pipe(
        switchMap(value => value
          ? transformParam(this.editItemFn, this.transformWithCompactFn)(item, value)
          : EMPTY
        )
      )
      .subscribe(() => this.updateItems());
  }

  private patchConfigWithItem(config: CreationConfig, item: any): CreationConfig {
    for (let option of config.options) {
      if (item[option.key] !== undefined && item[option.key] !== null) {
        option.value = item[option.key];
      }
    }
    return config;
  }

  protected onDeleteItem(tableRaw: any) {
    const item = Object.fromEntries(tableRaw);
    const { label, ...other } = this.deletionConfig;
    // to swap buttons in template
    [other.yes, other.no] = [other.no ?? 'Нет', other.yes ?? 'Да'];
    this.dialogService
      .open<boolean>(TUI_CONFIRM, {
        label: label,
        size: 's',
        data: other,
      })
      .pipe(
        switchMap(result => !result
          ? transformParam(this.deleteItemFn, this.transformWithCompactFn)(item)
          : EMPTY
        ),
      )
      .subscribe(() => this.updateItems());
  }

  protected onUpdateFilters(filters: typeof this.filterResult) {
    this.filterResult = compactObject(filters);
  }
}
