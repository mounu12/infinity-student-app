import { Injectable } from '@angular/core';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { RestApiService } from '@app-services/rest/rest-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends RestApiService{

  apiUrl = ApiUrlConstant.apiUrl;

  geDashboardData(): Observable<any>{
    // const url = this.apiUrl + `/api/boards`;
    const url = `assets/data/dashboard.json`;
    console.log(url)
    return this.get<any>(url);
  }
}
