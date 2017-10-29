import { ChartOptions } from './../../../models/chart-options-mondel';
import { Component, Input, OnChanges } from '@angular/core';
import { chartConfig } from '../../../config/chart-config';

@Component({
  selector: 'app-currency-chart',
  templateUrl: './currency-chart.component.html',
  styleUrls: ['./currency-chart.component.css']
})
export class CurrencyChartComponent implements OnChanges {
  chart: Object;
  options: ChartOptions;
  @Input()
  currencyName: string;
  @Input()
  currancyOHLCData: number[][];
  ngOnChanges() {
    // console.log(this.currancyOHLCData);
    this.options = chartConfig;
  }
}
