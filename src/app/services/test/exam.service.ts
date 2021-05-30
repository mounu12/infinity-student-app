import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { RestApiService } from '@app-services/rest/rest-api.service';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService extends RestApiService{

  apiUrl = ApiUrlConstant.examUrl;
  examinfo: any;
  examdetails: any;
  @Output() getExamInfo: EventEmitter<any> = new EventEmitter();
  @Output() submitExamFromHeader: EventEmitter<any> = new EventEmitter();
  @Output() showQuestionByNumber: EventEmitter<any> = new EventEmitter();
  @Output() showReportQuestionByNumber: EventEmitter<any> = new EventEmitter();
  @Output() testBegins: EventEmitter<any> = new EventEmitter();
  @Output() subjectChange: EventEmitter<any> = new EventEmitter();
  @Output() subjectChangeSolutionPage: EventEmitter<any> = new EventEmitter();
  private examMetaDataSource = new BehaviorSubject<any>({});
  examMetaData = this.examMetaDataSource.asObservable();

  updatedExamMetaDataSource(data: any){
    this.examMetaDataSource.next(data);
  }
  
  // geExamData(): Observable<any>{
  //   // const url = this.apiUrl + `/api/boards`;
  //   const url = `assets/data/exam.json`;
  //   console.log(url)
  //   return this.get<any>(url);
  // }

  submitExam(body_: any, _headers: any): Observable<any>{
    const url = this.apiUrl + `validatestudenttoken`;
    console.log(url)
    return this.getByHeaders<any>(url, body_, _headers);
  }

  getExamId(): Observable<any>{

    const url = this.apiUrl + `gentnextsequence`;
    return this.get(url);
  }

  postNode(url: any, payload: any): Observable<any> {
    const url_ = this.apiUrl + `${url}`;
    const headers = new Headers();
     headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', 'Bearer ' + this.token);
    // headers.append('Strict-Transport-Security', 'maxage=31536000');
    headers.append('X-Content-Type-Options', 'nosniff');
    headers.append('X-Frame-Options', 'SAMEORIGIN');

    
    return this.getByHeaders<any>(url_, payload, headers);

}

getByHeader(url: string, body: any, header_: any): Observable<any> {

  return this.getByHeaders<any>(url, body, header_);

}

get(url: string): Observable<any> {
  const headers = new Headers();
  // headers.append('Content-Type', 'application/json');
  // headers.append('Authorization', 'Bearer ' + this.token);

  // headers.append('Strict-Transport-Security', 'maxage=31536000');
  headers.append('X-Content-Type-Options', 'nosniff');
  headers.append('X-Frame-Options', 'SAMEORIGIN');

  return this.getByHeaders<any>(url, {}, headers);

}

post(url: string, payload: any): Observable<any> {
  const headers = new Headers();
   headers.append('Content-Type', 'application/json');
  // headers.append('Authorization', 'Bearer ' + this.token);
  // headers.append('Strict-Transport-Security', 'maxage=31536000');
  headers.append('X-Content-Type-Options', 'nosniff');
  headers.append('X-Frame-Options', 'SAMEORIGIN');

  return this.getByHeaders<any>(url, payload, headers);

}

  setPresentExamInfo(exam:any): void {
    this.examinfo = exam;
    this.getExamInfo.emit(exam);
    this.storage.store('examinfo', exam);
    console.log(exam,'examInfo---');
  }

  getPresentExamInfo(): any {
    let examinfo = this.storage.retrieve('examinfo');
    return examinfo;
  }

  setPresentExamDetails(exam:any): void {
    this.examdetails = exam;
    this.storage.store('presentexamdetails', exam);
  }

  getPresentExamDetails(): any {
    let examdetails = this.storage.retrieve('presentexamdetails')
    return examdetails;
  }

  triggerSubmitExam(): any {
    this.submitExamFromHeader.emit(null);
  }

  triggerTestBegins(): any {
    this.testBegins.emit(true);
  }
  triggerSubjectChange(): any {
    this.subjectChange.emit(true);
  }
  triggerSubjectChangeSolutionPage(): any {
    this.subjectChangeSolutionPage.emit(true);
  }
  

  showSelectedQuestion(questionNumber: any): any {
    this.showQuestionByNumber.emit(questionNumber);
  }
  showSelectedQuestionInReport(questionNumber: any): any {
    this.showReportQuestionByNumber.emit(questionNumber);
  }
}
