import { Injectable } from '@angular/core';
import { ActionAdvice } from '../../../models/action-advice';

@Injectable()
export class CrossingIndicatorsService {

	result: ActionAdvice;
	public CombinedCross(combinedAllData) {
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
		// const spreadBB = el.BBupperBand - el.BBlowerBand;
		// const spreadKC = el.KCupperKC - el.KClowerKC;
		const lowerChannelBorder = Math.min(el.BBlowerBand, el.KClowerKC);
		const upperChannelBorder = Math.min(el.BBupperBand, el.KCupperKC);
		const spread = upperChannelBorder - lowerChannelBorder;
		this.result = {
			open: el.open,
			close: el.close,
			low: el.low,
			high: el.high,
			time: el.time,
			overbought: false,
			oversold: false,
			crossPoint: null,
			spread
		};
		if (el.low < el.BBlowerBand && el.low < el.KClowerKC) {
			this.result.oversold = true;
			this.result.crossPoint = el.BBlowerBand;
			return this.result;
		}
		if (el.high > el.BBupperBand && el.high > el.KCupperKC) {
			this.result.overbought = true;
			this.result.crossPoint = el.BBupperBand;
			return this.result;
		}
		return this.result;
	}
}
