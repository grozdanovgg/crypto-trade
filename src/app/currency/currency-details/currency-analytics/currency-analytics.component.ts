import { ArrayService } from './../../../services/technical-indicators/utils/array.service';
import { IndicatorsService } from './../../../services/technical-indicators/indicators.service';
import { OCLHRawDdata } from './../../../models/OCLHdata';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-currency-analytics',
  templateUrl: './currency-analytics.component.html',
  styleUrls: ['./currency-analytics.component.css'],
  providers: [IndicatorsService, ArrayService]
})
export class CurrencyAnalyticsComponent implements OnInit {
  @Input()
  private currancyOHLCData: OCLHRawDdata[];
  protected techIndicators: {};
  protected techIndicatorsArray: string[];

  constructor(private indicatorsService: IndicatorsService) { }
  ngOnInit() {
    console.log(this.currancyOHLCData);
    this.techIndicators = {
      BBmiddleBand: this.indicatorsService.BB(this.currancyOHLCData).middleBand,
      BBupperBand: this.indicatorsService.BB(this.currancyOHLCData).upperBand,
      BBlowerBand: this.indicatorsService.BB(this.currancyOHLCData).lowerBand,
      KCmiddleKC: this.indicatorsService.KC(this.currancyOHLCData).middleKC,
      KClowerKC: this.indicatorsService.KC(this.currancyOHLCData).lowerKC,
      KCupperKC: this.indicatorsService.KC(this.currancyOHLCData).upperKC,
      EMA: this.indicatorsService.EMA(this.currancyOHLCData),
      SD: this.indicatorsService.SD(this.currancyOHLCData),
      SMA: this.indicatorsService.SMA(this.currancyOHLCData),
    };

    this.techIndicatorsArray = this.indicatorsObjToArray(this.techIndicators);

    console.log(this.techIndicators);
    console.log(this.techIndicatorsArray);
  }

  private indicatorsObjToArray(techIndicators) {
    let resultArray = [];
    Object.keys(techIndicators).forEach(indicator => {
      if (techIndicators[indicator] instanceof Array) {
        return resultArray.push(indicator);
      } else {
        const tempArr = Object.keys(techIndicators[indicator]).map(string => indicator + ' ' + string);
        resultArray = resultArray.concat(tempArr);
      }
    });
    return resultArray;
  }
}
