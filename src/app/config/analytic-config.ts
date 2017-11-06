

export const analytiConfig = {
	nPeriod: 400, // Period to analyse
	testCapital: {
		main: 1000,
		secondary: 3
	},
	momentProfitPercent: 0.8, // Expexted percentage proffit from a single moment action.
	usedAmmountPerAction: 0.5, // Part of 1 (ex. 0.3, 0.5 or 0.7 .. etc)
	timeFrame: 'histohour', // Options: histoday, histohour, histominute
	timeLimit: 400, // Period to fetch data. The best practice is to be similar to nPeriod
	// tslint:disable-next-line:max-line-length
	minSpread: 4, // Spread of the channels, below wich the alghoritm takes no actions - percentage value from the close price (ex. 5% spred for price 300 is realspread 15)
	offset: 0.4 // Percentage value. OFfcet from the channel when making initial order. Not to buy on the crossPoint
};


