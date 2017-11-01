import { ArrayService } from './../../../services/technical-indicators/utils/array.service';
import { IndicatorsService } from './../../../services/technical-indicators/indicators.service';
import { OCLHRawDdata } from './../../../models/OCLHdata';
import { Component, OnInit, Input } from '@angular/core';
import { CrossingIndicatorsService } from '../../../services/technical-indicators/analytics/crossing-indicators.service';

@Component({
	selector: 'app-currency-analytics',
	templateUrl: './currency-analytics.component.html',
	styleUrls: ['./currency-analytics.component.css'],
	providers: [IndicatorsService, ArrayService, CrossingIndicatorsService]
})
export class CurrencyAnalyticsComponent implements OnInit {
	@Input()
	private currancyOHLCData: OCLHRawDdata[];
	protected techIndicators: {};
	protected combinedIndicatorsData: {}[];
	protected combinedAllData: {}[];
	protected techIndicatorsArray: string[];
	protected crossEvents: {}[];

	constructor(private indicatorsService: IndicatorsService, private crossingIndicatorsService: CrossingIndicatorsService) { }
	ngOnInit() {
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
