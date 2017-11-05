import { CurrencyDetailsComponent } from './currency-details/currency-details.component';
import { CurrencyListingComponent } from './currency-listing/currency-listing.component';
import { CurrencyComponent } from './currency.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [

	{ path: 'currency', component: CurrencyListingComponent },
	{ path: 'currency/:id', component: CurrencyDetailsComponent },
	// { path: '', redirectTo: 'currency/all', pathMatch: 'full' },
	// { path: 'currency/all', component: CurrencyListingComponent },
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
	exports: [RouterModule],
	declarations: []
})
export class CurrencyRouterModule { }
