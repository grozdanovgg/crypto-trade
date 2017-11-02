import { HttpRequesterOptions } from './../models/http-requester-options';
import { HttpRequesterOptionsFactoryService } from './http-requester-options-factory.service';
import { HttpRequesterService } from './http-requester.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response, Http } from '@angular/http';

@Injectable()
export class CurrencyProviderService {



	private currencyListUrl = '/currency/listAll';
	private currencyDetailsUrl = '/currency/getDetailsById';
	private currencyPrices = '/currency/priceConversions';
	private currencyPricesHistoday = '/currency/historyPrice';

	private headersObj: {} = {
		'Content-Type': 'application/json',
	};

	// get("/api/contacts")
	// getContacts(): Promise<void | Contact[]> {
	// 	return this.http.get(this.contactsUrl)
	// 						 .toPromise()
	// 						 .then(response => response.json() as Contact[])
	// 						 .catch(this.handleError);
	// }

	constructor(private http: Http, private httpRequesterService: HttpRequesterService,
		private httpRequestOptionsFactory: HttpRequesterOptionsFactoryService) { }

	getAllCoinInformation(): Observable<Response> {
		const httpRequestOptions: HttpRequesterOptions =
			this.httpRequestOptionsFactory
				.createRequestOptions(this.currencyListUrl, this.headersObj);

		return this.httpRequesterService.get(httpRequestOptions);
	}

	getCoinDetailsById(currencyId: number): Observable<Response> {
		const httpRequestOptions: HttpRequesterOptions =
			this.httpRequestOptionsFactory
				.createRequestOptions(this.currencyDetailsUrl, { currencyId },
				this.headersObj);

		return this.httpRequesterService.post(httpRequestOptions);
	}

	getCoinPriceConversions(currencySymbol: string): Observable<Response> {
		const httpRequestOptions: HttpRequesterOptions =
			this.httpRequestOptionsFactory
				.createRequestOptions(this.currencyPrices, { symbol: currencySymbol },
				this.headersObj);

		return this.httpRequesterService.post(httpRequestOptions);
	}
	getCoinIOHLCInformation(baseCurrency): Observable<Response> {
		const httpRequestOptions: HttpRequesterOptions =
			this.httpRequestOptionsFactory
				.createRequestOptions(this.currencyPricesHistoday, { symbol: baseCurrency }, this.headersObj);

		return this.httpRequesterService.post(httpRequestOptions);
	}
}
