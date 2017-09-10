import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class UserRegistrationValidationService {

  constructor() { }

  public MatchPassword(group: FormGroup): ValidatorFn {
    const password = group.get('password').value; // to get value in input tag
    const confirmPassword = group.get('passwordConfirm').value; // to get value in input tag
    if (password !== confirmPassword) {
      group['passwordsMatch'] = false;
    } else {
      group['passwordsMatch'] = true;
      return null;
    }
  }

  // tslint:disable-next-line:one-line
  public formValid(group: FormGroup): ValidatorFn {
    if (group.root.get('passwords') && group.root) {
      if (group.root.get('passwords')['passwordsMatch'] &&
        group.root.valid
      ) {
        group.root['FormIsOK'] = true;
      } else {
        group.root['FormIsOK'] = false;
      }
    }
    return null;
  }

  // isUsernameTaken(username): Observable<Response>{

  // }

}