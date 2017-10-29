import { ChartOptions } from './../models/chart-options-mondel';

export const chartConfig: ChartOptions = {
    title: { text: `${this.currencyName} stock price` },
    series: [{
        name: this.currencyName,
        data: this.currancyOHLCData,
        tooltip: {
            valueDecimals: 6
        }
    }]
};
