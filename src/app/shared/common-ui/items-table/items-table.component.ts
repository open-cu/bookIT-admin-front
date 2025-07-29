import {Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, EMPTY, Observable, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {Pageable} from '../../../core/models/interfaces/pagination/pageable';
import {catchError} from 'rxjs/operators';
import {
  TuiTableCell,
  TuiTableDirective,
  TuiTablePagination,
  TuiTablePaginationEvent, TuiTableTbody,
  TuiTableTd, TuiTableTh, TuiTableThGroup, TuiTableTr
} from '@taiga-ui/addon-table';
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {AsyncPipe, NgClass} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {ColumnConfig, TableRow} from "./column-config";

@Component({
  selector: 'app-items-table',
    imports: [
        TuiTableDirective,
        TuiLoader,
        TuiTablePagination,
        AsyncPipe,
        TuiTableCell,
        TuiTableTd,
        TuiTableTh,
        TuiTableThGroup,
        TuiTableTbody,
        TuiTableTr,
        NgClass,
        TuiIcon,
    ],
  templateUrl: './items-table.component.html',
  styleUrl: './items-table.component.css'
})
export class ItemsTableComponent<T extends object> implements OnChanges, OnDestroy {
  @Input({
    required: true,
    alias: 'columns'
  })
  public columnConfigs!: ColumnConfig[];

  @Input({
    required: true,
    alias: 'loadFn'
  })
  public loadItemsFn!: (params: any) => Observable<Pageable<T>>;

  @Input('title') tableTitle = 'Таблица'
  @Input('editable') isEditable = false;
  @Input('deletable') isDeletable = false;

  @Output('OnFilter') onFilterOpenedEmitter = new EventEmitter<void>();
  @Output('OnEdit') onEditEmitter = new EventEmitter<TableRow>();
  @Output('OnDelete') onDeleteEmitter = new EventEmitter<TableRow>();

  protected readonly page$ = new BehaviorSubject(0);
  protected readonly size$ = new BehaviorSubject(10);
  protected readonly total$ = new BehaviorSubject(0);
  protected readonly loading$ = new BehaviorSubject(false);
  protected items$: Observable<Pageable<T>>;

  protected readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private sanitizer = inject(DomSanitizer);
  protected readonly editingBlockKey = 'editing' as const;

  constructor() {
    this.items$ = this.loadItems();
  }

  ngOnChanges() {
    this.items$ = this.loadItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected updateItems() {
    this.refresh$.next();
  }

  private loadItems() {
    return combineLatest([
      this.page$,
      this.size$,
      this.refresh$
    ]).pipe(
      takeUntil(this.destroy$),
      tap(() => this.loading$.next(true)),
      switchMap(([page, size]) =>
        this.loadItemsFn({ size, page }).pipe(
          tap(response => {
            this.total$.next(response.totalElements);
            this.loading$.next(false);
          }),
          catchError(error => {
            this.loading$.next(false);
            console.error('Data loading error: ', error);
            return EMPTY;
          })
        )
      )
    );
  }

  protected onPagination({page, size}: TuiTablePaginationEvent): void {
    this.page$.next(page);
    this.size$.next(size);
  }

  protected getRows(obj: object) {
    return Object.entries(obj);
  }

  protected changeFilter(source: any) {
    this.page$.next(0);
    return source;
  }

  protected getCellValue(value: any, row: [string, any][], column: ColumnConfig) {
    const rawValue = value;

    if (column.render) {
      return this.sanitizer.bypassSecurityTrustHtml(
          column.render(rawValue, row)
      );
    }
    return rawValue;
  }

  protected getCellClasses(value: any, row: [string, any][], column: ColumnConfig) {
    if (typeof column.cssClass === 'function') {
      return column.cssClass(value, row);
    }
    return column.cssClass ?? '';
  }

  protected getColumnsKeys() {
    const res = this.columnConfigs.map(column => column.key);
    if (this.isEditable || this.isDeletable) {
      res.push(this.editingBlockKey);
    }
    return res;
  }

  protected getColumnsTitles() {
    const res = this.columnConfigs.map(column => column?.title ?? column.key);
    if (this.isEditable || this.isDeletable) {
      res.push('');
    }
    return res;
  }

  protected onFilterOpened() {
    this.onFilterOpenedEmitter.emit();
  }
}
