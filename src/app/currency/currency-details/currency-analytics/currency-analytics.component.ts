import { ArrayService } from './../../../services/technical-indicators/utils/array.service';
import { IndicatorsService } from './../../../services/technical-indicators/indicators.service';
import { OCLHRawDdata } from './../../../models/OCLHdata';
import { Component, OnInit, Input } from '@angular/core';
import { CrossingIndicatorsService } from '../../../services/technical-indicators/analytics/crossing-indicators.service';

// const MOCK_DATA = {
// 	platformName: 'Kraken',
// 	pair: 'EHTXBT',
// 	graphPeriodTpe: 'days',
// 	graphPeriod: 1,
// 	periodsBack: 100,
// 	buyCondition: (
// 		BBmiddleBand,
// 		BBupperBand,
// 		BBlowerBand,
// 		KCmiddleKC,
// 		KClowerKC,
// 		KCupperKC,
// 		EMA,
// 		SD,
// 		SMA) => {
// 		if (BBmiddleBand > SMA) { // TODO real case?
// 			return true;
// 		}
// 		return false;
// 	},
// 	sellCondition: () => { },
// 	ammount: 10,
// 	currency: 'ETH',
// 	stopLossPercent: 10,
// 	actionTriggerOffsetPercent: 3,
// 	investmentStepsAmmount: [50, 20, 20, 10], // Percents of the sum invested on each step for the current action
// 	investmentStepsSizePercent: 3, // On how mych price change should the next step trigger
// 	mode: 'backtesting', // backtesting || trading || margin-trading
// 	data: {}, // The current market data for the pair
// };

// class Bot {
// 	constructor(data: any,
// 		buyCondition: () => boolean,
// 		sellCondition: () => boolean,
// 		indicators: {}
// 	) {

// 	}
// }

@Component({
    selector: 'app-currency-analytics',
    templateUrl: './currency-analytics.component.html',
    styleUrls: ['./currency-analytics.component.css'],
    providers: [IndicatorsService, ArrayService, CrossingIndicatorsService]
})

export class CurrencyAnalyticsComponent implements OnInit {
    @Input()

    // public bot: Bot;

    private currancyOHLCData: OCLHRawDdata[];
    protected techIndicators: {};
    protected combinedIndicatorsData: {}[];
    protected combinedAllData: {}[];
    protected techIndicatorsArray: string[];
    protected crossEvents: {}[];

    constructor(private indicatorsService: IndicatorsService, private crossingIndicatorsService: CrossingIndicatorsService) { }
    ngOnInit() {
        // on form send to create new Bot

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

        this.combinedIndicatorsData = this.combineIndicatorsData(this.techIndicators, this.techIndicatorsArray);

        this.combinedAllData = this.combineAllData(this.currancyOHLCData, this.combinedIndicatorsData);

        this.crossEvents = this.crossingIndicatorsService.BBcross(this.combinedAllData);

        console.log(this.currancyOHLCData);
        console.log(this.combinedIndicatorsData);
        console.log(this.combinedAllData);
        console.log(this.crossEvents);

        // console.log(this.techIndicators);


        // this.bot = new Bot(MOCK_DATA, MOCK_DATA.buyCondition, MOCK_DATA.sellCondition, { this.techIndicators });
    }

    private combineAllData(currancyOHLCData, combinedIndicatorsData) {
        const combinedArr = [];
        let combinedObj = {};
        const currancyOHLCDataReversed = currancyOHLCData.reverse();
        const combinedIndicatorsDataReversed = combinedIndicatorsData.reverse();
        for (let i = 0; i < combinedIndicatorsDataReversed.length; i += 1) {
            combinedObj = Object.assign(currancyOHLCDataReversed[i], combinedIndicatorsDataReversed[i]);
            combinedArr.push(combinedObj);
        }
        return combinedArr;
    }

    private combineIndicatorsData(techIndicators, techIndicatorsArray) {
        const firstIndicatorArray = techIndicators[Object.keys(techIndicators)[0]];
        const arr = [];
        for (let i = 0; i < firstIndicatorArray.length; i += 1) {
            const obj = {};
            techIndicatorsArray.forEach(name => {
                obj[name] = techIndicators[name][i];
            });
            arr.push(obj);
        }
        return arr;
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
