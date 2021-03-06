import { ProfileComponent } from './../users/profile/profile.component';
import { HttpRequesterOptionsFactoryService } from './http-requester-options-factory.service';
import { HttpRequesterOptions } from './../models/http-requester-options';
import { HttpRequesterService } from './http-requester.service';
import { UserAuthService } from './user-auth.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

@Injectable()
export class UserService {

	private headersObj: {} = { 'Content-Type': 'application/json' };
	private registerUserUrl = '/api/auth/register';
	private loginUserUrl = '/api/auth/login';
	private logoutUserUrl = '/api/auth/logout';
	private profileUrl = '/user/profile';
	private updateUserUrl = '/user/update';

	private userCurrenciesUrl = '/user/currencies';

	constructor(
		private httpRequesterService: HttpRequesterService,
		private httpRequestOptionsFactory: HttpRequesterOptionsFactoryService,
		private userAuthService: UserAuthService
	) { }

	registerUser(user: User): Observable<Response> {
		const httpRequestOptions = this.httpRequestOptionsFactory
			.createRequestOptions(this.registerUserUrl, user, this.headersObj);

		return this.httpRequesterService.post(httpRequestOptions);
	}

	loginUser(user: User): Observable<Response> {
		const httpsRequestHeaders = this.httpRequestOptionsFactory
			.createRequestOptions(this.loginUserUrl, user, this.headersObj);

		return this.httpRequesterService.post(httpsRequestHeaders);
	}

	logoutUser(): Observable<Response> {
		const httpsRequestHeaders = this.httpRequestOptionsFactory
			.createRequestOptions(this.logoutUserUrl);

		return this.httpRequesterService.get(httpsRequestHeaders);
	}

	getUserCurrencies(): Observable<Response> {
		const currentUser = this.userAuthService.getLoggedUser();

		const httpRequestHeaders = this.httpRequestOptionsFactory
			.createRequestOptions(this.userCurrenciesUrl, { username: currentUser }, this.headersObj);

		return this.httpRequesterService.post(httpRequestHeaders);
	}

	getUserDetails(): Observable<Response> {
		const httpsRequestHeaders = this.httpRequestOptionsFactory
			.createRequestOptions(this.profileUrl, { user: this.userAuthService.getLoggedUser() }, this.headersObj);

		return this.httpRequesterService.post(httpsRequestHeaders);
	}

	updateUserDetails(user: User): Observable<Response> {
		const httpsRequestHeaders = this.httpRequestOptionsFactory
			.createRequestOptions(this.updateUserUrl, user, this.headersObj);

		return this.httpRequesterService.post(httpsRequestHeaders);
	}
}
