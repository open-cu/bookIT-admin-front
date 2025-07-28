import {Component, inject, OnChanges} from '@angular/core';
import {FilterBlockComponent} from '../../shared/common-ui/filter-block/filter-block.component';
import {TuiButton, TuiLoader} from '@taiga-ui/core';
import {
  TuiTableCell,
  TuiTableDirective,
  TuiTablePagination,
  TuiTablePaginationEvent, TuiTableTbody,
  TuiTableTd, TuiTableTh, TuiTableThGroup, TuiTableTr
} from '@taiga-ui/addon-table';
import {BehaviorSubject, combineLatest, EMPTY, Observable, switchMap, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {Pageable} from '../../core/models/interfaces/pagination/pageable';
import {TicketService} from '../../core/services/api/ticket.service';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-tickets-page',
  imports: [
    FilterBlockComponent,
    TuiButton,
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
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent implements OnChanges {
  protected fields = {
    date: 'По дате',
    area: 'По помещению',
    description: 'По описанию',
  };

  protected readonly page$ = new BehaviorSubject(0);
  protected readonly size$ = new BehaviorSubject(10);
  protected readonly total$ = new BehaviorSubject(0);
  protected readonly loading$ = new BehaviorSubject(false);
  protected tickets$: Observable<Pageable<Ticket>>;
  protected columns = ["id", "userId", "areaId", "type", "description"];

  private ticketService = inject(TicketService);

  constructor() {
    this.tickets$ = this.loadTickets();
  }

  ngOnChanges() {
    this.tickets$ = this.loadTickets();
  }

  private loadTickets() {
    return combineLatest([this.page$, this.size$]).pipe(
      tap(() => this.loading$.next(true)),
      switchMap(([page, size]) =>
        this.ticketService.getList({ size, page }).pipe(
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

  protected getEntries(obj: object) {
    return Object.entries(obj);
  }
}
