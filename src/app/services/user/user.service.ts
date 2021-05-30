import { Injectable } from '@angular/core';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { RestApiService } from '@app-services/rest/rest-api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService extends RestApiService{

  apiUrl = ApiUrlConstant.apiUrl;

  User: any;

  mobileAndName: any;

  // tslint:disable-next-line:typedef
  setUser(user: any) {
    localStorage.setItem('user',JSON.stringify(this.User = user));
  }

  // tslint:disable-next-line:typedef
  setMobileAndName(userDetails: any) {
    localStorage.setItem('mobile_and_name',JSON.stringify(this.mobileAndName = userDetails));
  }

  // tslint:disable-next-line:typedef
  getMobileAndName() {
    return this.mobileAndName;
  }

  // tslint:disable-next-line:typedef
  getUser() {
    let user;
    if(this.User) {
      user = this.User;
    } else if(this.mobileAndName) {
      user = {
        personalDetails: this.mobileAndName
      }
    } else if(localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user') as string);
      this.setUser( user);
    }  else if(localStorage.getItem('mobile_and_name')) {
      const mobile_and_name = JSON.parse(localStorage.getItem('mobile_and_name') as string);
      user = {
        personalDetails: mobile_and_name
      };
    } else user = {}
    return user;
  }

  emptyUser() {
    this.User = null;
    this.mobileAndName = null;
  }

  uploadImage(userId: any,obj: any): any {
    const url = this.apiUrl + `/file/upload/${userId}`;
    return this.post(url, obj);
  }

  deleteImage(fileName: any,userId: any): any {
    const url = this.apiUrl + `/file/delete/${fileName}/${userId}`;
    return this.delete(url);
  }

  loadUserDetails(userId:any): Observable<any> {
    const url = this.apiUrl + `/api/users/getuser/${userId}`;
    return this.get(url);
  }

  updateUserDetails(obj: any): Observable<any> {
    const url = this.apiUrl + `/api/users/update`;
    return this.post(url, obj);
  }

  updatePassword(password: any,userId:any): Observable<any> {
    const url = this.apiUrl + `/api/users/updatePW/${password}/${userId}`;
    return this.get(url);
  }

  checkMobileNumber(userId:any,phoneNumber: any): Observable<any> {
    const url = this.apiUrl + `/api/users/editphonenumber/${userId}/${phoneNumber}`;
    return this.get(url);
  }

}
