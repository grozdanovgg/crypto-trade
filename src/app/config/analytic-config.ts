

export const analytiConfig = {
	nPeriod: 400, // Period to analyse
	testCapital: {
		main: 1000,
		secondary: 3
	},
	momentProfitPercent: 0.7,
	usedAmmountPerAction: 1, // Part of 1 (ex. 0.3, 0.5 or 0.7 .. etc)
	timeFrame: 'histohour', // Options: histoday, histohour, histominute
	timeLimit: 400, // Period to fetch data. The best practice is to be similar to nPeriod
	minSpread: 5 // Percentage value from the close price (ex. 5% spreda for price 300 is realspread 15)
};


