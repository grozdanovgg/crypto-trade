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

		this.crossEvents = this.crossingIndicatorsService.CombinedCross(this.combinedAllData, analytiConfig.offset);

		// console.log(this.currancyOHLCData);
		// console.log(this.combinedIndicatorsData);
		// console.log(this.combinedAllData);
		console.log(this.crossEvents);
		// console.log(this.userBalance);


		const testTradeResults = this.
			simulateTrade(
			analytiConfig.testCapital,
			this.crossEvents,
			analytiConfig.nPeriod,
			analytiConfig.momentProfitPercent,
			analytiConfig.minSpread
			);
		console.log(analytiConfig.testCapital);
		console.log(testTradeResults);

		// console.log(this.techIndicators);
	}

	private simulateTrade(initialCapital, data, nPeriod, wantedProfitPercent, minSpread) {

		// const capitalArr = Object.keys(initialCapital);
		let capitalMain = initialCapital.main;
		let capitalSecondary = initialCapital.secondary;
		const currentData = data.slice(0, nPeriod).reverse();

		// Status of the moment: action, afterAction, idle; Prev action buy/sell
		const startCapitalMain = (currentData[0].close * initialCapital.secondary) + initialCapital.main;
		let endCapitalMain = null;

		const momentStatus = { is: 'idle', prevAction: null, prevActionPrice: null, currentCapital: startCapitalMain };

		for (let i = 1; i < currentData.length; i += 1) {
			const moment = currentData[i];
			const prevMoment = currentData[i - 1];
			const nextMoment = currentData[i + 1];
			const minRealSpread = moment.close * (minSpread / 100);
			const currentSpread = moment.spread;

			// Main logic based on previus moment
			if (momentStatus.is === 'afterAction') {
				if (momentStatus.prevAction === 'buy') { // Try to sell
					const wantedSellPrice = momentStatus.prevActionPrice * ((100 + (wantedProfitPercent)) / 100);
					console.log('Wanted sell price ' + wantedSellPrice);
					if (wantedSellPrice < moment.high) {
						capitalMain += (capitalSecondary * analytiConfig.usedAmmountPerAction * wantedSellPrice);
						capitalSecondary -= (capitalSecondary * analytiConfig.usedAmmountPerAction);
					} else { // If the predictionis unsuccesfull, I suppose that may stop the losss in 3x the limit of the "profitPercent"
						console.log('PREDICTION UNSUCCESSFUL');
						capitalMain += ((capitalSecondary * analytiConfig.usedAmmountPerAction) * moment.close);
						capitalSecondary -= (capitalSecondary * analytiConfig.usedAmmountPerAction);
					}

				} else if (momentStatus.prevAction === 'sell') { // Try to buy
					const wantedBuyPrice = momentStatus.prevActionPrice * ((100 - (wantedProfitPercent)) / 100);
					console.log('Wanted buy price ' + wantedBuyPrice);
					// Check may I buy
					if (wantedBuyPrice > moment.low) {
						capitalSecondary += (capitalMain * analytiConfig.usedAmmountPerAction / wantedBuyPrice);
						capitalMain -= (capitalMain * analytiConfig.usedAmmountPerAction);
					} else { // If the predictionis unsuccesfull, I suppose that may stop the losss in 3x the limit of the "profitPercent"
						console.log('PREDICTION UNSUCCESSFUL');
						capitalSecondary += ((capitalMain * analytiConfig.usedAmmountPerAction) / moment.close);
						capitalMain -= (capitalMain * analytiConfig.usedAmmountPerAction);
					}
				} else {
					console.log('CHECK ERROR IN CALCULATIONS');
				}
				momentStatus.is = 'idle';
			} else if (moment.crossPoint && momentStatus.is === 'idle' && currentSpread > minRealSpread) {
				momentStatus.is = 'action';
				// just record the strart trading capital to compare it later
				// if (!startCapitalMain) {
				// 	startCapitalMain = (moment.crossPoint * capitalSecondary) + capitalMain;
				// }

				// Simulate trading
				if (moment.overbought && capitalSecondary > 0) {
					// // Sell secondary currency
					// capitalMain += (capitalSecondary * analytiConfig.usedAmmountPerAction * moment.crossPoint);
					// capitalSecondary -= capitalSecondary * analytiConfig.usedAmmountPerAction;
					// momentStatus.prevAction = 'sell';
					// momentStatus.prevActionPrice = moment.crossPoint;
					// momentStatus.is = 'afterAction';

					// CHANGED SPT
					capitalSecondary += (capitalMain * analytiConfig.usedAmmountPerAction / moment.crossPoint);
					capitalMain -= (capitalMain * analytiConfig.usedAmmountPerAction);
					momentStatus.prevAction = 'buy';
					momentStatus.prevActionPrice = moment.crossPoint;
					momentStatus.is = 'afterAction';
				} else if (moment.oversold && capitalMain > 0) {
					// // Buy secondary currency
					// capitalSecondary += (capitalMain * analytiConfig.usedAmmountPerAction / moment.crossPoint);
					// capitalMain -= (capitalMain * analytiConfig.usedAmmountPerAction);
					// momentStatus.prevAction = 'buy';
					// momentStatus.prevActionPrice = moment.crossPoint;
					// momentStatus.is = 'afterAction';

					// CHANGED SPOT
					capitalMain += (capitalSecondary * analytiConfig.usedAmmountPerAction * moment.crossPoint);
					capitalSecondary -= capitalSecondary * analytiConfig.usedAmmountPerAction;
					momentStatus.prevAction = 'sell';
					momentStatus.prevActionPrice = moment.crossPoint;
					momentStatus.is = 'afterAction';
				}
				// endCapitalMain = (moment.crossPoint * capitalSecondary) + capitalMain;
			}
			momentStatus.currentCapital = capitalMain + (capitalSecondary * moment.close);
			console.log({ capitalMain, capitalSecondary });
			console.log(momentStatus);
			console.log(moment);
			console.log('=======');
		}


		endCapitalMain = (currentData[currentData.length - 1].close * capitalSecondary) + capitalMain;
		console.log({ startCapitalMain, endCapitalMain });
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
