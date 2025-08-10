import {Component} from '@angular/core';
import {
  NewUsersByYearMonthChartComponent
} from '../../shared/common-ui/charts/new-users-by-year-month-chart/new-users-by-year-month-chart.component';

@Component({
  selector: 'app-stats-page',
  imports: [
    NewUsersByYearMonthChartComponent
  ],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css'
})
export class StatsPageComponent {
}
