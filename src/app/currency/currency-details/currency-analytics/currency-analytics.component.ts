import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-currency-analytics',
  templateUrl: './currency-analytics.component.html',
  styleUrls: ['./currency-analytics.component.css']
})
export class CurrencyAnalyticsComponent implements OnInit {
  @Input()
  currancyOHLCData: number[][];
  constructor() { }

  ngOnInit() {
    console.log(this.currancyOHLCData);
  }

}
