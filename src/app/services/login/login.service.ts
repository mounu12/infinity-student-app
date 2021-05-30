import { Injectable } from '@angular/core';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { RestApiService } from '@app-services/rest/rest-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends RestApiService{

  apiUrl = ApiUrlConstant.apiUrl;

  login(obj:any,countryCode:string): Observable<any> {
    // console.log(obj);
    const url = this.apiUrl + `/api/users/loginwithPhAndPw/${countryCode}/${obj.phone}/${obj.password}`;
    console.log(url)
    return this.get(url);
  }
}
