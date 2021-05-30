import { Injectable } from '@angular/core';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { RestApiService } from '@app-services/rest/rest-api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BoardsService extends RestApiService{

  apiUrl = ApiUrlConstant.apiUrl;

  getBoardsList(): Observable<any>{
    const url = this.apiUrl + `/api/boards`;
    console.log(url)
    return this.get<any>(url);
  }
  getGradesList(): Observable<any>{
    const url = this.apiUrl + `/api/grades`;
    console.log(url)
    return this.get<any>(url);
  }
  getTargetExamList(): Observable<any>{
    const url = this.apiUrl + `/api/targetexams`;
    console.log(url)
    return this.get<any>(url);
  }
}
