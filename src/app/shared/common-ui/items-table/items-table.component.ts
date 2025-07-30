import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, effect,
  EventEmitter,
  inject,
  Input, model,
  OnChanges,
  OnDestroy,
  Output, signal
} from '@angular/core';
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
import {QueryParams} from '../../../core/services/api/api.service';

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
  styleUrl: './items-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  @Output('OnFilterOpened') onFilterOpenedEmitter = new EventEmitter<void>();
  @Output('OnEdit') onEditEmitter = new EventEmitter<TableRow>();
  @Output('OnDelete') onDeleteEmitter = new EventEmitter<TableRow>();

  public additionalParams = model<QueryParams>({}, {alias: 'params'});

  protected readonly page$ = new BehaviorSubject(0);
  protected readonly size$ = new BehaviorSubject(10);
  protected readonly total$ = new BehaviorSubject(0);
  protected readonly isLoading = signal(false);
  protected items$!: Observable<Pageable<T>>;

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();

  private sanitizer = inject(DomSanitizer);
  private changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly editingBlockKey = 'editing' as const;

  constructor() {
    effect(() => {
      if (!this.isLoading()) {
        this.changeDetectorRef.markForCheck();
      }
    });
    effect(() => {
      this.updateItems();
      this.items$ = this.loadItems();
    });
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
    this.isLoading.set(true);
  }

  private loadItems() {
    return combineLatest([
      this.page$,
      this.size$,
      this.refresh$
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([page, size]) =>
        this.loadItemsFn({ size, page, ...this.additionalParams() }).pipe(
          tap(response => {
            this.total$.next(response.totalElements);
            this.isLoading.set(false);
          }),
          catchError(error => {
            this.isLoading.set(false);
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

  protected getCellValue(value: any, column: ColumnConfig) {
    const rawValue = value;

    if (column.render) {
      return this.sanitizer.bypassSecurityTrustHtml(
          column.render(rawValue)
      );
    }
    return rawValue;
  }

  protected getCellClasses(value: any, column: ColumnConfig) {
    if (typeof column.cssClass === 'function') {
      return column.cssClass(value);
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
