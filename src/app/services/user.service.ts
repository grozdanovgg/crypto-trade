import { HttpRequesterOptionsFactoryService } from './http-requester-options-factory.service';
import { HttpRequesterOptions } from './../models/http-requester-options';
import { HttpRequesterService } from './http-requester.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

@Injectable()
export class UserService {

  private headersObj: {} = { 'Content-Type': 'application/json' };
  private registerUserUrl = '/auth/register';
  private loginUserUrl = '/auth/login';
  private logoutUserUrl = '/auth/logout';

  constructor(
    private httpRequesterService: HttpRequesterService,
    private httpRequestOptionsFactory: HttpRequesterOptionsFactoryService
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
}