import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlConstant } from 'src/app/constants/api-url.constant';
import { RestApiService } from '../rest/rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService extends RestApiService {

  apiUrl = ApiUrlConstant.apiUrl;

  sendWelcomeMessage(isdCode:string, phoneNumber: any): Observable<any> {
    const url = this.apiUrl + `/api/watsapp/welcomemessage/${isdCode}/${phoneNumber}`;
    return this.get<any>(url);
  }

}
