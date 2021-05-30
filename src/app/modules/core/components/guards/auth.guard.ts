import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
// import { AuthService } from '@app-core/components/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService,
              public router: Router) { }

  canActivate(): any {
    const token: any = localStorage.getItem('token');
    if (!token) {
      this.auth.updateAuthStatus(false);
      this.router.navigate([`home`]);
      return false;
    }
    this.auth.updateAuthStatus(true);
    return true;
  }

}
