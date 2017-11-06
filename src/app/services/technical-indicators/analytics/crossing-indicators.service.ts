import { Injectable } from '@angular/core';
import { ActionAdvice } from '../../../models/action-advice';

@Injectable()
export class CrossingIndicatorsService {

	result: ActionAdvice;
	public CombinedCross(combinedAllData, offset) {
		const resultArr = [];
		combinedAllData.forEach(el => {
			const crossedEl = this.crossElement(el, offset);
			resultArr.push(crossedEl);
		});
		return resultArr;
	}

	private crossElement(el, offset) {
		const riseOffsetCoef = (100 + offset) / 100;
		const dropOffsetCoef = (100 - offset) / 100;
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
		if (el.low < (lowerChannelBorder * dropOffsetCoef)) {
			this.result.oversold = true;
			this.result.crossPoint = lowerChannelBorder;
			return this.result;
		}
		if (el.high > (upperChannelBorder * riseOffsetCoef)) {
			this.result.overbought = true;
			this.result.crossPoint = upperChannelBorder;
			return this.result;
		}
		return this.result;
	}
}
