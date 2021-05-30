import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: any = localStorage.getItem('token');
        const studentId: any = (localStorage.getItem('mobile_and_name'));
        // const accesstoken: any = localStorage.getItem('accesstoken');
        const tenant = 'infinitylearn'
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
            // request = request.clone({ headers: request.headers.set('accesstoken', token) });
            // request = request.clone({ headers: request.headers.set('studentid', studentId?.mobile) });
        }

        if(!token || token === 'undefined' || token==='') {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer') });
        }

        request = request.clone({ headers: request.headers.set('X-Tenant', tenant) });
        // request = request.clone({ params: request.params.append('X-Tenant', tenant) });

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        // request = request.clone({ headers: request.headers.set('Accept', '**') });

        // if(request.headers.has('Accept')) {
        //     request = request.clone({headers: request.headers.set('Accept', '**')})
        // }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                }
                return event;
            }));
    }
}
