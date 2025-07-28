import { Component } from '@angular/core';
import {FilterBlockComponent} from '../../shared/common-ui/filter-block/filter-block.component';
import {TuiButton} from '@taiga-ui/core';

@Component({
  selector: 'app-tickets-page',
  imports: [
    FilterBlockComponent,
    TuiButton
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent {
  protected fields = {
    date: 'По дате',
    area: 'По помещению',
    description: 'По описанию',
  };
}
