import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlConstant } from 'src/app/constants/api-url.constant';
import { RestApiService } from '../rest/rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService extends RestApiService {

  apiUrl = ApiUrlConstant.apiUrl;

  signUp(obj:any,countryCode:string): Observable<any> {
    if(obj.firstName && obj.lastName){
      const url = this.apiUrl + `/api/users/generateOtp/${countryCode}/${obj.phone}?firstName=${obj.firstName}&lastName=${obj.lastName}&isWhatsappConsent=${obj.isWhatsappConsent}`;
      return this.get(url);
    } else {
      const url = this.apiUrl + `/api/users/generateOtp/${countryCode}/${obj.phone}`;
      return this.get(url);
    }
  }

  sendOtp(phone: any,countryCode:string): Observable<any> {
    const url = this.apiUrl + `/sms/${phone}`;
    return this.get<any>(url);
  }

  validatePhoneNumber(phone:any, otp: any): Observable<any> {
    const url = this.apiUrl + `/api/users/validate/${phone}/${otp}`;
    return this.get<any>(url);
  }
  
  validateOtp(countryCode:string,phone: any,otp:any): Observable<any> {
    const url = this.apiUrl + `/api/users/validateOtp/${countryCode}/${phone}/${otp}`;
    return this.get<any>(url);
  }

  getCountryCodes(): Observable<any> {
    const url = this.apiUrl + `/api/countrycodes`;
    return this.get<any>(url);
  }

  verifyPhoneNumber(obj:any): Observable<any> {
    const url = this.apiUrl + `/api/users/verifyPhoneNumber/${obj.dialCode}/${obj.number}`;
    return this.get<any>(url);
  }

  register(obj: any): any {
    const url = this.apiUrl + `/api/users/register`;
    return this.post(url, obj);
  }

  // forgot password

  validateOtpForForgotPassword(isdCode:any,phone:any, otp: any): Observable<any> {
    const url = this.apiUrl + `/api/users/forgotpassword/validateOtp/${isdCode}/${phone}/${otp}`;
    return this.get<any>(url);
  }

  forgotPassword(obj: any): Observable<any> {
    const url = this.apiUrl + `/api/users/forgotpassword/reset/${obj.isdCode}/${obj.phoneNumber}/${obj.password}`;
    return this.get(url);
  }
  // forgot password
}
