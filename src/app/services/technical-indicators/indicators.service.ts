import { ArrayService } from './utils/array.service';
import { OCLHRawDdata } from './../../models/OCLHdata';
import { Injectable } from '@angular/core';

@Injectable()
export class IndicatorsService {

    private decimals = 4;
    private nPeriod = 20;

    constructor(private arrayService: ArrayService) { }
    public SMA(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const closings = data.map(obj => obj.close);
        const SMAArrayLength = closings.length - nPeriod;
        const SMAArray = [];
        for (let i = 0; i <= SMAArrayLength; i += 1) {
            let singleSMA = null;
            for (let j = 0; j < nPeriod; j += 1) {
                singleSMA += closings[i + j];
            }
            singleSMA /= nPeriod;
            const result = singleSMA.toFixed(this.decimals);
            SMAArray.push(+result);
        }
        return SMAArray;
    }

    public EMA(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const closingsRaw = data.map(obj => obj.close);

        // const closingsRaw = data.closings.slice();
        const closingsLength = closingsRaw.length;
        const closings = closingsRaw.reverse().slice(nPeriod - 1, closingsLength);
        const SMAArray = this.SMA(data, nPeriod);
        const firstBase = SMAArray[SMAArray.length - 1];
        let base = null;
        let firstBaseActive = true;
        const multiplier = (2 / (nPeriod + 1));
        const EMAArrayLength = SMAArray.length;
        const EMAArray = [];

        for (let i = 0; i < EMAArrayLength; i += 1) {
            if (!firstBaseActive) {
                base = (closings[i] * multiplier) + (EMAArray[0] * (1 - multiplier));
            } else {
                base = firstBase;
                firstBaseActive = false;
            }
            EMAArray.unshift(base);
        }
        return EMAArray;
    }


    public SD(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const nPeriodDeviationsArray = this.deviations(data, nPeriod);
        const forLength = nPeriodDeviationsArray.length;
        const variancesArr = [];
        let variance = null;
        for (let i = 0; i < forLength; i += 1) {
            variance = this.arrayService.average(nPeriodDeviationsArray[i]);
            variancesArr.push(Math.sqrt(variance));
        }
        return variancesArr;
    }

    public BB(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const SMA = this.SMA(data, nPeriod);
        const SD = this.SD(data, nPeriod);
        const middleBand = SMA;
        const upperBand = SMA.map((num, idx) => {
            return +(num + (SD[idx] * 2)).toFixed(this.decimals);
        }).splice(0, middleBand.length);
        const lowerBand = SMA.map((num, idx) => {
            return +(num - (SD[idx] * 2)).toFixed(this.decimals);
        }).splice(0, middleBand.length);
        const boilengerBands = {
            middleBand,
            upperBand,
            lowerBand
        };
        return boilengerBands;
    }

    public KC(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const EMA = this.EMA(data, nPeriod);
        const ATR = this.averageTrueRange(data, +(nPeriod / 2).toFixed(0));
        const upperKC = [];
        const lowerKC = [];
        let singleUpperKC = null;
        let singleLowerKC = null;
        for (let i = 0; i < EMA.length; i += 1) {
            singleUpperKC = EMA[i] + (2 * ATR[i]);
            singleLowerKC = EMA[i] - (2 * ATR[i]);
            lowerKC.push(singleLowerKC);
            upperKC.push(singleUpperKC);
        }
        const result = {
            middleKC: EMA,
            lowerKC,
            upperKC
        };
        return result;
    }
    
    // Private metthods
    private deviations(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const means = this.SMA(data, nPeriod);
        const closings = data.map(obj => obj.close);
        const deviationsArrayLength = means.length;
        const deviationsHistoryArray = [];
        const nPeriodDeviationsArray = [];
        for (let i = 0; i < deviationsArrayLength; i += 1) {
            const historyDeviatons = [];
            let singleHistoryDeviation = null;
            for (let j = 0; j <= nPeriod; j += 1) {
                singleHistoryDeviation = Math.pow((closings[i + j] - means[i]), 2);
                if (singleHistoryDeviation) {
                    historyDeviatons.push(singleHistoryDeviation);
                }
            }
            nPeriodDeviationsArray.push(historyDeviatons);
        }
        return nPeriodDeviationsArray;
    }
    private trueRange(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const rowClosings = data.map(obj => obj.close);
        const rowLowests = data.map(obj => obj.low);
        const rowHighests = data.map(obj => obj.high);
        const length = rowClosings.length;
        const trueRange = [];

        const closings = rowClosings;
        const lowests = rowLowests;
        const highests = rowHighests;

        let diff = null;
        let diffOne = null;
        let diffTwo = null;
        let diffTree = null;
        for (let i = 0; i < length; i += 1) {
            if (i < length - 1) {
                diffOne = highests[i] - lowests[i];
                diffTwo = Math.abs(highests[i] - closings[i + 1]);
                diffTree = Math.abs(lowests[i] - closings[i + 1]);
                diff = Math.max(diffOne, diffTwo, diffTree);
            } else {
                diff = highests[i] - lowests[i];
            }
            trueRange.push(diff);
        }
        return trueRange;
    }
    private averageTrueRange(data: OCLHRawDdata[], nPeriod = this.nPeriod) {
        const ATRArray = [];
        const TR = this.trueRange(data, nPeriod).reverse(); // oldest values are first
        const length = TR.length - nPeriod;
        const TRAverage = this.arrayService.average(TR.slice(0, nPeriod));
        let singleATR = null;
        let isFirst = true;

        for (let i = 0; i <= length; i += 1) {
            if (!isFirst) {
                singleATR = ((ATRArray[0] * (nPeriod - 1)) + TR[i + nPeriod - 1]) / nPeriod;
            } else {
                singleATR = TRAverage;
                isFirst = false;
            }
            ATRArray.unshift(singleATR);
        }
        return ATRArray;
    }
}
