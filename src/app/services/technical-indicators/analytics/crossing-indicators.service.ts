import { Injectable } from '@angular/core';
import { ActionAdvice } from '../../../models/action-advice';

@Injectable()
export class CrossingIndicatorsService {

	result: ActionAdvice;
	public BBcross(combinedAllData) {
		const resultArr = [];
		combinedAllData.forEach(el => {
			const crossedEl = this.crossElement(el);
			if (!crossedEl) {
				return;
			}
			resultArr.push(this.crossElement(el));
		});
		return resultArr;
	}

	private crossElement(el) {
		this.result = {
			time: el.time,
			overbought: false,
			oversold: false,
			crossPoint: 0
		};
		if (el.low < el.BBlowerBand) {
			this.result.oversold = true;
			this.result.crossPoint = el.BBlowerBand;
			return this.result;
		}
		if (el.high > el.BBupperBand) {
			this.result.overbought = true;
			this.result.crossPoint = el.BBupperBand;
			return this.result;
		}
		return;
	}
}
