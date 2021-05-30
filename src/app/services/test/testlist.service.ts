import { Injectable } from '@angular/core';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { RestApiService } from '@app-services/rest/rest-api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TestlistService extends RestApiService{

  apiUrl = ApiUrlConstant.examUrl;


  getPreviousAndPresentMockTests(_headers: any): Observable<any>{
    const url = this.apiUrl + `validatestudenttoken`;
    console.log(url)
    return this.getByHeaders<any>(url, {}, _headers);
  }


  getStudentExamResult(body_: any, _headers: any): Observable<any>{
    const url = this.apiUrl + `validatestudenttoken`;
    console.log(url)
    return this.getByHeaders<any>(url, body_, _headers);
  }

  saveToken(body_: any, _headers: any): Observable<any>{
    const url = this.apiUrl + `setaccesstoken `;
    console.log(url)
    return this.getByHeaders<any>(url, {}, _headers);
  }
}
