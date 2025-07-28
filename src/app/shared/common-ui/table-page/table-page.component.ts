import {Component, inject, Input, OnChanges} from '@angular/core';
import {BehaviorSubject, combineLatest, EMPTY, Observable, switchMap, tap} from 'rxjs';
import {Pageable} from '../../../core/models/interfaces/pagination/pageable';
import {catchError} from 'rxjs/operators';
import {
  TuiTableCell,
  TuiTableDirective,
  TuiTablePagination,
  TuiTablePaginationEvent, TuiTableTbody,
  TuiTableTd, TuiTableTh, TuiTableThGroup, TuiTableTr
} from '@taiga-ui/addon-table';
import {TuiLoader} from "@taiga-ui/core";
import {AsyncPipe, NgClass} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {ColumnConfig} from "./column-config";

@Component({
  selector: 'app-table-page',
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
  ],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css'
})
export class TablePageComponent<T extends object> implements OnChanges {
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

  protected readonly page$ = new BehaviorSubject(0);
  protected readonly size$ = new BehaviorSubject(10);
  protected readonly total$ = new BehaviorSubject(0);
  protected readonly loading$ = new BehaviorSubject(false);
  protected items$: Observable<Pageable<T>>;

  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.items$ = this.loadItems();
  }

  ngOnChanges() {
    this.items$ = this.loadItems();
  }

  private loadItems() {
    return combineLatest([this.page$, this.size$]).pipe(
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
    return this.columnConfigs.map(column => column.key);
  }

  protected getColumnsTitles() {
    return this.columnConfigs.map(column => column?.title ?? column.key);
  }
}
