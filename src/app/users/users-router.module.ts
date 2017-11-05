import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	{ path: 'user/register', component: RegisterComponent },
	{ path: 'user/login', component: LoginComponent },
	{ path: 'user/logout', component: LogoutComponent },
	{ path: 'user/profile', component: ProfileComponent }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	],
	declarations: []
})
export class UsersRouterModule { }
