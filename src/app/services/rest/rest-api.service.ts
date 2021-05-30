import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  // TimeoutTime = TimeoutData.TIMEOUT_TIME;
  constructor(private http: HttpClient, protected storage: LocalStorageService) { }

  protected get<T>(url: string): Observable<T> {
    return this.http.get<any>(url)
      .pipe(map(data => {
        // Array.isArray(data.body) ? data.body : Observable.throw(new Error(data.httpStatus));
        // data.payload = this.transformerService.parseJsonData(data.payload);
        return data;
      }));
  }

  protected getWithHeaders<T>(url: string, headers: any): Observable<T> {
    return this.http.get<any>(url, {headers: headers})
      .pipe(map(data => {
        // Array.isArray(data.body) ? data.body : Observable.throw(new Error(data.httpStatus));
        // data.payload = this.transformerService.parseJsonData(data.payload);
        return data;
      }));
  }

  protected getByHeaders<T>(url: string, body: any, headers: any): Observable<T> {
    return this.http.post<any>(url, body, {headers: headers})
      .pipe(map(data => {
        // Array.isArray(data.body) ? data.body : Observable.throw(new Error(data.httpStatus));
        // data.payload = this.transformerService.parseJsonData(data.payload);
        return data;
      }));
  }

  // protected getWithTimeout<T>(url: string): Observable<T> {
  //   return this.http.get<any>(url)
  //     .pipe(
  //       timeout(this.TimeoutTime),
  //     //   map(data => {
  //     //   // Array.isArray(data.body) ? data.body : Observable.throw(new Error(data.httpStatus));
  //     //   // data.payload = this.transformerService.parseJsonData(data.payload);
  //     //   console.log(data);
  //     //   return data;
  //     // }),
  //     catchError(e => {
  //       // do something on a timeout of(e);
  //       return throwError(e);
  //     }));
  // }


  protected getArray<T>(url: string): Observable<T> {
    // this.logger.debug( 'Intercepted http request: ', url );
    return this.http.get<any>(url)
      .pipe(map(data => {
        return data;
      }));
  }

  protected put<T>(url: string, obj?: any): Observable<T> {
    return this.http.put<any>(url, obj)
      .pipe(map(data => {
        return data;
      }));
  }

  protected post<T>(url: string, obj?: any): Observable<T> {
    return this.http.post<any>(url, obj)
      .pipe(map(data => {
        return data;
      }));
  }

  protected delete(url: string, body?: any): Observable<any> {
    return this.http.delete<any>(url, body)
      .pipe(map(data => {
        return data;
      }));
  }

  protected readTextFile<T>(url: string): Observable<T> {
    return this.http.get<any>(url)
      .pipe(map(data => {
        return data;
      }));
  }

}

