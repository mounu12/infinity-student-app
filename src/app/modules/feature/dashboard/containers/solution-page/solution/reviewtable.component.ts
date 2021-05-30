import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core'
import { ReplaySubject, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators'
import { FormControl } from '@angular/forms';
import { ExamService } from '../../../../../../services/test/exam.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Rules } from '../../../../../shared/models/rules.model';

@Component({
  selector: 'air-antd-table-reviewtbl',
  templateUrl: './reviewtable.component.html',
  styles: [
    `
      .table-operations {
        margin-bottom: 16px;
      }

      .table-operations > button {
        margin-right: 8px;
      }
    `,
  ],
})
export class ReviewTableComponent implements OnInit {
  @Output() updateRules = new EventEmitter<Rules>()
  subject$: ReplaySubject<Rules[]> = new ReplaySubject<Rules[]>(1);
  data$: Observable<Rules[]> = this.subject$.asObservable();

  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  listOfFilterName = [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }]
  listOfFilterAddress = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }]
  ruleses: Rules[]
  cRSuperSet: Rules[]
  searchCtrl = new FormControl()
  allrules = [];
  allschedules = [];



  mapOfSort: { [key: string]: any } = {
    rulename: null,
    schedulename: null,
    description: null,
    duration: null,
    examtype: null,
    totalquestions: null

  }
  sortName: string | null = null
  sortValue: string | null = null
  userObj:any;
  role = null;
  constructor(
    private apiProvider: ExamService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private router: Router,
    private storage: LocalStorageService,
    
    
  ) {
    this.userObj = this.storage.retrieve('userDetails');
    this.role = this.storage.retrieve('ROLE');
  }

  sort(sortName: string, value: string): void {
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
    }

    if (sortName && value) {
      const toSort = [...this.allrules];
      this.allrules = [];
      this.allrules = toSort.sort((a, b) => {
        if (!a.hasOwnProperty(sortName) || !b.hasOwnProperty(sortName)) {
          return 0;
        }
        const varA = a[sortName];
        const varB = b[sortName];
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        } else if (varA) {
          comparison = 1;
        } else if (varB) {
          comparison = -1;
        }
        return value === 'ascend' ? comparison * -1 : comparison;
      })
    }
  }


  ngOnInit() {
    this.getallschedules();
    this.data$.pipe(filter<Rules[]>(Boolean)).subscribe(allcardss => {
      this.ruleses = allcardss
      this.cRSuperSet = allcardss
     })

    this.searchCtrl.valueChanges.subscribe(value => this.onFilterChange(value));
    this.getallRules();
  }

  onFilterChange(value: string) {
    this.ruleses = this.cRSuperSet.filter(rules => {
      const reqVal = {
        rulename: rules.rulename,
        schedulename: rules.schedulename,
        description: rules.description,
        duration: rules.duration,
        time: rules.time,
        span: rules.span,
        examtype: rules.examtype,
        totalquestions: rules.totalquestions

      }
      return JSON.stringify(Object.values(reqVal))
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase())
    })
  }

  getallRules() {
    this.apiProvider.get('rules').subscribe(
      async resdata => {
        // console.log(resdata);
        if (resdata != null) {
          this.allrules = resdata;
          this.getData().subscribe(resdata => {
            this.subject$.next(resdata)
          })
        }
      },
      async () => { },
    )
  }

  getallschedules() {

    this.apiProvider.get('examschedule').subscribe(
      async resdata => {
        if (resdata != null) {
          this.allschedules = resdata;

        }
      },
      async () => { },
    )

  }
  getdisplayname(va: any) {
    const filterarray = this.allschedules.filter(item => item.id == va);
    return filterarray[0].examname;
    //return datacode[1] + ' (' + va[0].value + ')';
  }

  getData() {
    return of(this.allrules.map(rules => new Rules(rules)))
  }

  saveRule(insertdata: any) {
    this.apiProvider.post('rules', insertdata).subscribe(
      async resdata => {
        if (resdata.id) {
          this.notification.success('Success', 'Rules saved successfully');
          this.getallRules();
        } else {
          this.notification.warning('Warning', 'Failed to save the rules please try again');
        }
      },
      async () => { },
    )

  }

  reviewquestions(data){
    const postdata = {
      scheduleid: data.scheduleid,
      ruleid: data.id,
      createdby:this.userObj.id
    }
    this.spinner.show();
    this.storage.clear('examdata');
    this.storage.clear('questiondata');
    this.storage.clear('newquestions');
    this.storage.clear('questioncounter');
    this.apiProvider.postNode('examschedule', postdata).subscribe(
      async resdata => {
        if (resdata.schedule) {
          this.storage.store('examdata', resdata.schedule);
          this.apiProvider.postNode('examquestions', postdata).subscribe(
            async resdata1 => {
              if (resdata1.questions) {
                console.log(resdata1.questions);
                this.storage.store('rules', data);
                this.storage.store('questiondata', resdata1.questions);
                this.spinner.hide();
                this.router.navigate(['/exam/questions']);
              } else {
                this.spinner.hide();
                this.notification.warning('Warning', 'No Questions Found');
              }
            },
            async () => { },
          )
    
      
       
        } else {
          this.spinner.hide();
          this.notification.warning('Warning', 'No Questions Found');
        }
      },
      async () => { },
    )
  }

  generateQuestions(data) {

    const postdata = {
      scheduleid: data.scheduleid,
      ruleid: data.id,
      createdby:this.userObj.id
    }
    this.spinner.show();
    this.apiProvider.postNode('generatequestions', postdata).subscribe(
      async resdata => {
     console.log(resdata);   
    this.storage.clear('examdata');
    this.storage.clear('questiondata');
    this.storage.clear('newquestions');
    this.storage.clear('questioncounter');
    this.apiProvider.postNode('examschedule', postdata).subscribe(
      async resdata => {
        if (resdata.schedule) {
          this.storage.store('examdata', resdata.schedule);
          let cancontinue =true; 
          this.apiProvider.postNode('examquestions', postdata).subscribe(
            async resdata1 => {
              console.log(resdata1);
              resdata1.questions.subjects.forEach(element => {
                if(element.questions.length ==0){
                  cancontinue =false;
                }
                
              });
              console.log(cancontinue);
              if(cancontinue) {
                data.status='UNDERREVIEW';
              this.apiProvider.post('rules', data).subscribe(
                async resdata12 => {
              if (resdata1.questions) {
                console.log(resdata1.questions);
                this.storage.store('rules', data);
                this.storage.store('questiondata', resdata1.questions);
                this.spinner.hide();
                this.router.navigate(['/exam/questions']);
              } else {
                this.spinner.hide();
                this.notification.warning('Warning', 'No Questions Found');
              }
            },
            async () => { },
          )
              }else{

                this.apiProvider.postNode('removefilteredquestions', postdata).subscribe(
                  async resdata12 => {
                    this.notification.warning('Warning', 'No Questions Found'); 
              },
              async () => { },
            )
   
              }
              
        },
        async () => { },
      )
       
        } else {
          this.spinner.hide();
          this.notification.warning('Warning', 'No Questions Found');
        }
      },
      async () => { },
    )
  },
  async () => { },
)
    


  }
}
