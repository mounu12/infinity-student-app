import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: BehaviorSubject<any>;
  photo: BehaviorSubject<any>;
  isExamStarted: BehaviorSubject<any>;
  pass_key: BehaviorSubject<any>;

  constructor(public jwtHelper: JwtHelperService) {
    this.isAuth = new BehaviorSubject('');
    this.photo = new BehaviorSubject('');
    this.isExamStarted = new BehaviorSubject('');
    this.pass_key = new BehaviorSubject('')
  }

  public isAuthenticated(): boolean {
    const token: any = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    if(token!== null){
      return true
    } else {
      return false
    }
    // return !this.jwtHelper.isTokenExpired(token);
  }

  updateAuthStatus(status: boolean): void {
    this.isAuth.next(status);
  }

  public decode(token: string): any {
    const data = this.jwtHelper.decodeToken(token);
    return data;
  }

  getPhoto(): Observable<string> {
    // this.photo = localStorage.getItem('photo')
    return this.photo.asObservable();
    // return localStorage.getItem('photo')
}

setPhoto(user: any) {
    this.photo.next(user);
}

getIsExamStarted(): Observable<string> {
  return this.isExamStarted.asObservable();
}

setIsExamStarted(value: any) {
  this.isExamStarted.next(value);
}

getPasskey(): Observable<string> {
  return this.pass_key.asObservable();
}

setPasskey(value: any) {
  this.pass_key.next(value);
}
}
