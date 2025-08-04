import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal
} from '@angular/core';
import {BehaviorSubject, combineLatest, delay, EMPTY, Observable, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {Pageable} from '../../../core/models/interfaces/pagination/pageable';
import {catchError} from 'rxjs/operators';
import {
  TuiTableCell,
  TuiTableDirective,
  TuiTablePagination,
  TuiTablePaginationEvent,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
  TuiTableThGroup,
  TuiTableTr
} from '@taiga-ui/addon-table';
import {TuiIcon, TuiLoader, TuiScrollbar} from "@taiga-ui/core";
import {AsyncPipe, NgClass, NgStyle} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {ColumnConfig, TableRow} from "./column-config";
import {QueryParams} from '../../../core/services/api/api.service';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-items-table',
  standalone: true,
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
    NgStyle,
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
  @Input('title') tableTitle = 'Таблица';
  @Input('editable') isEditable = false;
  @Input('deletable') isDeletable = false;
  @Input() paramsToQuery: string[] | boolean = false;
  @Input('trackFn') itemTrackBy?: (item: T) => any;

  @Input() showRowNumbers = false;
  @Input() rowNumberTitle: string = '№';

  @Output('OnFilterOpened') onFilterOpenedEmitter = new EventEmitter<void>();
  @Output('OnEdit') onEditEmitter = new EventEmitter<TableRow>();
  @Output('OnDelete') onDeleteEmitter = new EventEmitter<TableRow>();

  public additionalParams = model<QueryParams>({}, {alias: 'params'});

  protected readonly page = signal(0);
  protected readonly size = signal(10);
  protected readonly total = signal(0);
  protected readonly isLoading = signal(false);

  protected items$!: Observable<Pageable<T>>;
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly destroy$ = new Subject<void>();
  private readonly request$ = combineLatest([
    toObservable(this.page),
    toObservable(this.size),
    toObservable(this.additionalParams),
    this.refresh$,
  ]).pipe(
    takeUntil(this.destroy$)
  );

  private sanitizer = inject(DomSanitizer);
  protected cdr = inject(ChangeDetectorRef);
  protected readonly EDITING_BLOCK_KEY = 'editing' as const;
  protected readonly ROW_NUMBER_KEY = 'rowNumber' as const;

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
      switchMap(([page, size, params]) => {
        const queryParams = { size, page, ...params };

        return this.loadItemsFn(queryParams).pipe(
          tap(response => {
            this.total.set(response.totalElements);
            this.isLoading.set(false);
          }),
          catchError(error => {
            this.isLoading.set(false);
            console.error('Data loading error: ', error);
            return EMPTY;
          })
        )
      }),
    );
  }

  protected onPaginationChange({page, size}: TuiTablePaginationEvent) {
    this.page.set(page);
    this.size.set(size);
  }

  protected getRows(obj: object) {
    return Object.entries(obj);
  }

  protected getCellValue(value: any, i: number, raw: TableRow, column: ColumnConfig) {
    const rawValue = value;

    if (column.render) {
      return this.sanitizer.bypassSecurityTrustHtml(
        column.render(rawValue, i, raw)
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
    let res: string[] = [];
    if (this.showRowNumbers) {
      res.push(this.ROW_NUMBER_KEY);
    }
    res.push(...this.columnConfigs.map(column => column.key));
    if (this.isEditable || this.isDeletable) {
      res.push(this.EDITING_BLOCK_KEY);
    }
    return res;
  }

  protected getColumnsTitles() {
    let res: string[] = [];
    if (this.showRowNumbers) {
      res.push(this.rowNumberTitle);
    }
    res.push(...this.columnConfigs.map(column => column?.title ?? column.key));
    if (this.isEditable || this.isDeletable) {
      res.push('');
    }
    return res;
  }

  protected isColumnDisabled(index: number): boolean {
    return this.columnConfigs[index]?.disabled === true;
  }

  protected isColumnVisible(index: number): boolean {
    if (index >= this.columnConfigs.length) {
      return this.isEditable || this.isDeletable;
    }
    return !this.isColumnDisabled(index);
  }
}
