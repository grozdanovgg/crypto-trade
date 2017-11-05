import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'currency', loadChildren: 'app/currency/currency.module#CurrencyModule' },
	{ path: 'user', loadChildren: 'app/users/users.module#UsersModule' },
	{ path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRouterModule { }
