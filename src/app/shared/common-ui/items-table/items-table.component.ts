import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input, model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, signal, WritableSignal
} from '@angular/core';
import {BehaviorSubject, combineLatest, delay, EMPTY, Observable, Subject, switchMap, tap} from 'rxjs';
import {Pageable} from '../../../core/models/interfaces/pagination/pageable';
import {catchError} from 'rxjs/operators';
import {
  TuiTableCell,
  TuiTableDirective,
  TuiTablePagination,
  TuiTablePaginationEvent, TuiTableTbody,
  TuiTableTd, TuiTableTh, TuiTableThGroup, TuiTableTr
} from '@taiga-ui/addon-table';
import {TuiIcon, TuiLoader, TuiScrollbar} from "@taiga-ui/core";
import {AsyncPipe, NgClass} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {ColumnConfig, TableRow} from "./column-config";
import {QueryParams} from '../../../core/services/api/api.service';
import {toObservable} from '@angular/core/rxjs-interop';

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
    TuiScrollbar,
  ],
  templateUrl: './items-table.component.html',
  styleUrl: './items-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsTableComponent<T extends object> implements OnInit, OnChanges, OnDestroy {
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
  private readonly params$ = toObservable(this.additionalParams);
  private readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.params$,
    this.refresh$,
  ]);

  private sanitizer = inject(DomSanitizer);
  protected cdr = inject(ChangeDetectorRef);
  protected readonly editingBlockKey = 'editing' as const;
  @Input() updateSignal!: WritableSignal<boolean>;

  ngOnInit() {
    this.items$ = this.loadItems();
  }

  ngOnChanges() {
    this.updateItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected updateItems() {
    this.ngOnInit();
    this.refresh$.next();
    this.cdr.markForCheck();
  }

  private loadItems() {
    return this.request$.pipe(
      tap(() => this.isLoading.set(true)),
      delay(200),
      switchMap(([page, size, params]) =>
        this.loadItemsFn({ size, page, ...params }).pipe(
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
