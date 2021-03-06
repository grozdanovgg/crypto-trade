import { PriceCalculatorPipe } from './../pipes/price-calculator.pipe';
import { DirectivesExportModule } from './../directives/directives-export.module';
import { CurrencyTransactionsService } from './../services/currency-transactions.service';
import { CurrencyDataFormatterPipe } from './../pipes/currency-data-formatter.pipe';
import { CurrencyChartComponent } from './currency-details/currency-chart/currency-chart.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts/highstock';
import { CurrencyDetailsFactoryService } from './../services/currency-details-factory.service';
import { CurrencyProcessorService } from './../services/currency-processor.service';
import { CurrencyComponent } from './currency.component';
import { CurrencyDetailsComponent } from './currency-details/currency-details.component';
import { CurrencyListingComponent } from './currency-listing/currency-listing.component';
import { CurrencyRouterModule } from './currency-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageUrlFormatterPipe } from '../pipes/image-url-formatter.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CurrencyAnalyticsComponent } from './currency-details/currency-analytics/currency-analytics.component';

export function highchartsFactory() {
	return highcharts;
}
@NgModule({
	imports: [
		CurrencyRouterModule,
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		ChartModule,
		NgxDatatableModule,
		DirectivesExportModule
	],
	declarations: [
		CurrencyComponent,
		CurrencyListingComponent,
		CurrencyDetailsComponent,
		ImageUrlFormatterPipe,
		CurrencyDataFormatterPipe,
		PriceCalculatorPipe,
		CurrencyChartComponent,
		CurrencyAnalyticsComponent
	],
	providers: [{
		provide: HighchartsStatic,
		useFactory: highchartsFactory
	},
		CurrencyProcessorService,
		CurrencyDetailsFactoryService,
		CurrencyTransactionsService
	]
})
export class CurrencyModule { }
