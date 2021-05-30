import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app-core/components/auth-service/auth.service';
// import { LoginService } from '@app-services/login/login.service';
import { NGXLogger } from 'ngx-logger';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authReq:any;

  constructor(
              private logger: NGXLogger,
              public auth: AuthService,
              public router: Router, 
              // private loginService: LoginService,
              private authService: AuthService, 
              private toastr: ToastrService,
              private dialog: MatDialog,
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    // const authToken: any = this.oktaAuth.getAccessToken();

    // this.oktaAuth.tokenManager.get('accessToken')];

    const token: any = localStorage.getItem('token');
    const tenant : any = localStorage.getItem('tenant');


    // this.logger.debug( 'Intercepted http request: ', url );


    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    // const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    if(tenant){
    this.authReq = req.clone({ withCredentials : true, setHeaders: { Authorization: `Bearer ${token}`, X_TENANT_ID: tenant } });
    } else if(token) {
      this.authReq = req.clone({ withCredentials : true, setHeaders: { Authorization: `Bearer ${token}` } });
    } else { 
      this.authReq = req.clone({withCredentials : true});
    }

    this.logger.debug('Intercepted http request: ', this.authReq ? this.authReq.url : '');

    // send cloned request with header to the next handler.
    // return next.handle(this.authReq);

    return next.handle(this.authReq)
    // .catch(err => {
    //   // const tenant : any = localStorage.getItem('tenant');
    //   console.log('1a',err, '\n', err.status, '\n', err.error);
    //   console.log('1b', (err.status === 401 && err.error === 'Unauthorized'));
    //   console.log('1c', err.error.statuCode, (err.error.statuCode === 401));
    //   // if (err.status === 401 && err.statusText === 'Unauthorized' && tenant) {
    //   if (err.status === 401 && err.error === 'Unauthorized') {
    //     this.getNewTokenFromRefreshToken()
    //   } else if(err.error.statuCode === 401) {
    //     this.toastr.warning(err.error.message);
    //     this.dialog.closeAll();
    //     this.auth.updateAuthStatus(false);
    //     this.router.navigate(['/login']);
    //   }
    //   return throwError(err);
    // });
  }

  // getNewTokenFromRefreshToken(): any {
  //   const userId = JSON.parse(localStorage.getItem('loggedUser'))._id
  //   this.loginService.refreshToken(userId).subscribe((data: any) => {
  //     if (data.statusCode === 200) {
  //       localStorage.setItem('token', data.accessToken);
  //       this.decodeUserInfo(data.accessToken);
  //       this.navigate(this.router);
  //     }
  //   },
  //     (err) => {                                     // on error
  //       console.log('2a',err);
  //       console.log('2b',err.status === 401 && err.error === 'Unauthorized');
  //       // if (err.error.statuCode === 401 && err.statusText === 'Unauthorized') {
  //       //   this.toastr.warning(err.error.message);
  //       //   this.dialog.closeAll();
  //       //   this.auth.updateAuthStatus(false);
  //       //   this.router.navigate(['/login']);
  //       // } else {
  //       // console.log(err);
  //       // }
  //     }
  //     );
  // }

  decodeUserInfo(token: string): void {
    const tokenInfo = this.authService.decode(token);
    localStorage.setItem('loggedUser', JSON.stringify(tokenInfo));
  }

  // navigate(router): void {
  //   console.log('route', router, router.url);
  //   this.router.navigate(['/']);
  //   // location.assign(router.url);
  //   // this.router.navigate([`${router.routerState.snapshot.url}`]);
  //   } 
}
