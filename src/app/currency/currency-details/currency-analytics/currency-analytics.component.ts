import { ArrayService } from './../../../services/technical-indicators/utils/array.service';
import { IndicatorsService } from './../../../services/technical-indicators/indicators.service';
import { OCLHRawDdata } from './../../../models/OCLHdata';
import { Component, OnInit, Input } from '@angular/core';
import { CrossingIndicatorsService } from '../../../services/technical-indicators/analytics/crossing-indicators.service';
import { analytiConfig } from '../../../config/analytic-config';

@Component({
	selector: 'app-currency-analytics',
	templateUrl: './currency-analytics.component.html',
	styleUrls: ['./currency-analytics.component.css'],
	providers: [IndicatorsService, ArrayService, CrossingIndicatorsService]
})
export class CurrencyAnalyticsComponent implements OnInit {
	@Input()
	private currancyOHLCData: OCLHRawDdata[];
	@Input()
	private userBalance: number;
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

		// console.log(this.currancyOHLCData);
		// console.log(this.combinedIndicatorsData);
		// console.log(this.combinedAllData);
		console.log(this.crossEvents);
		// console.log(this.userBalance);


		const testTradeResults = this.
			simulateTrade(analytiConfig.testCapital, this.crossEvents, analytiConfig.nPeriod, analytiConfig.momentProfitPercent);
		console.log(analytiConfig.testCapital);
		console.log(testTradeResults);

		// console.log(this.techIndicators);
	}

	private simulateTrade(initialCapital, data, nPeriod, profitPercent) {
		// const capitalArr = Object.keys(initialCapital);
		let capitalMain = initialCapital.main;
		let capitalSecondary = initialCapital.secondary;
		const currentData = data.slice(0, nPeriod).reverse();

		// Status of the moment: action, afterAction, idle; Prev action buy/sell
		const momentStatus = { is: 'idle', prevAction: null };

		let startCapitalMain = null;
		let endCapitalMain = null;

		for (let i = 1; i < currentData.length - 1; i += 1) {
			const moment = currentData[i];
			const prevMoment = currentData[i - 1];
			const nextMoment = currentData[i + 1];

			// Main logic based on previus moment
			if (momentStatus.is === 'afterAction') {
				if (momentStatus.prevAction === 'buy') { // Try to sell
					const wantedSellPrice = moment.crossPoint * ((100 + (profitPercent / 2)) / 100);

					if (wantedSellPrice < moment.high) {
						capitalMain += capitalSecondary * wantedSellPrice;
						capitalSecondary -= capitalSecondary;
					} else { // If the predictionis unsuccesfull, I suppose that may stop the losss in 3x the limit of the "profitPercent"
						capitalMain += capitalSecondary * moment.high * ((100 + (3 * profitPercent)) / 100);
						capitalSecondary -= capitalSecondary;
					}

				} else if (momentStatus.prevAction === 'sell') { // Try to buy
					const wantedBuyPrice = moment.crossPoint * ((100 - (profitPercent / 2)) / 100);

					// Check may I buy
					if (wantedBuyPrice > moment.low) {
						capitalSecondary += capitalMain / wantedBuyPrice;
						capitalMain -= capitalMain;
					} else { // If the predictionis unsuccesfull, I suppose that may stop the losss in 3x the limit of the "profitPercent"
						capitalSecondary += capitalMain / moment.low * ((100 + (3 * profitPercent)) / 100);
						capitalMain -= capitalMain;
					}
				} else {
					console.log('CHECK ERROR IN CALCULATIONS');
				}
				momentStatus.is = 'idle';
			} else if (moment.crossPoint && momentStatus.is === 'idle') {
				momentStatus.is = 'action';
				// just record the strart trading capital to compare it later
				if (!startCapitalMain) {
					startCapitalMain = (moment.crossPoint * capitalSecondary) + capitalMain;
				}

				// Simulate trading
				if (moment.overbought) {
					// Sell secondary currency
					capitalMain += capitalSecondary * moment.crossPoint;
					capitalSecondary -= capitalSecondary;
					momentStatus.prevAction = 'sell';
				} else if (moment.oversold) {
					// Buy secondary currency
					capitalSecondary += capitalMain / moment.crossPoint;
					capitalMain -= capitalMain;
					momentStatus.prevAction = 'buy';
				}
				console.log('=======');
				endCapitalMain = (moment.crossPoint * capitalSecondary) + capitalMain;

				momentStatus.is = 'afterAction';
			}
		}
		return { capitalMain, capitalSecondary, startCapitalMain, endCapitalMain };
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
