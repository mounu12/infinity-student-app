import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { ExamService } from '../../../../../services/test/exam.service';
import { TestlistService } from '../../../../../services/test/testlist.service';
import { UserService } from '@app-services/user/user.service';
import { MyReportsComponent } from '../dashboard/my-reports/my-reports.component';
import { LocalStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  overallTests = [];
  studentExamResult = [];
  examtype = "";
  alltestlist = [];
  token: any;
  detail: any;
  infoBoxes = [
    {
      logo: 'assets/img/peper-icon.svg',
      heading: 'NEET Previous Year Papers',
      paper: {
        total: 0,
        completed: 0,
        totalTimeSpent: 0,
        highestScore: 0
      },
      infotext: 'Practice the previous year papers from 2010 and be ready for your NEET exam',
      link: {
        label: 'OPEN LIST',
        route: 'dashboard/testlist'
      }
    },
    {
      logo: 'assets/img/tests-icons.svg',
      heading: 'NEET Mock Tests',
      paper: {
        total: 0,
        completed: 0,
        totalTimeSpent: 0,
        highestScore: 0
      },
      infotext: 'We\’ve curated 50+ mock tests to help you reach your best potential for the exam',
      link: {
        label: 'OPEN LIST',
        route: 'dashboard/testlist?examtype=MOCKTEST'
      }
    }
  ];
  @ViewChild(MyReportsComponent) myreportscomponent: MyReportsComponent = new MyReportsComponent();
  filterTestList: any;

  constructor(private dashboardService: DashboardService,
    private examservice: ExamService, private testListService: TestlistService, private router: Router, private route: ActivatedRoute, private userService: UserService,
    private store: LocalStorageService,private spinner: NgxSpinnerService) {
    this.route.queryParams.subscribe(params => {

      this.token = localStorage.getItem('token')
      this.detail = this.userService.getMobileAndName()
      console.log("value: " + this.detail)
      this.examtype = params['examtype'];
      if (params['examtype'] === 'MOCKTEST') {
        this.infoBoxes.splice(0, 1)
      } else {
        this.infoBoxes.splice(1, 1)
      }

    });
  }

  ngOnInit(): void {

    let _headers = {
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'methodtype': 'RULES'
    };
    this.spinner.show();
    this.testListService.getPreviousAndPresentMockTests(_headers).subscribe((overallTests: any) => {
      console.log(overallTests,'overallTests')
      let test_;
      if (this.examtype === 'MOCKTEST') {
        test_ = overallTests.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN');
      } else {
        test_ = overallTests.filter((dr: any) => dr.examtype !== 'MOCKTEST' && dr.examtype !== 'JEEMAIN');
      }

      this.alltestlist = test_;
      this.filterTestList = test_
      console.log(this.alltestlist,'current_alltestlist')
      this.infoBoxes[0].paper.total = test_.length;

      this.overallTests = overallTests;

    })

    let _headers_for_Exam = {
      'methodtype': 'GETTESTS',
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'Content-Type': 'application/json'
    };
    let _body_for_exam_result = {
      "studentid": localStorage.getItem('studentid'),
      "scheduleid": "null",
      "ruleid": "null"
    }

    this.testListService.getStudentExamResult(_body_for_exam_result, _headers_for_Exam).subscribe((allTestsbyStudent: any) => {
      let test_;
      if (this.examtype === 'MOCKTEST') {
        test_ = allTestsbyStudent.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN');
      } else {
        test_ = allTestsbyStudent.filter((dr: any) => dr.examtype !== 'MOCKTEST' && dr.examtype !== 'JEEMAIN');
      }

      console.log(test_,'users_test_result');

      this.infoBoxes[0].paper.completed = test_.length;
      test_.forEach((test: any) => {
        this.infoBoxes[0].paper.totalTimeSpent += Number(test.totaltimespend);
        this.infoBoxes[0].paper.highestScore < Number(test.score) ? this.infoBoxes[0].paper.highestScore = Number(test.score) : '';

        this.alltestlist.forEach((testrow: any) => {
          if (testrow._id === test.ruleid) {
            testrow.testtaken = true
            testrow.totaltimespend = test.totaltimespend
            testrow.score = test.score
            testrow.examsubmittedon = test.examsubmittedon
          }
        })

      });

      this.studentExamResult = allTestsbyStudent;
      this.myreportscomponent.setInfoBoxes(this.infoBoxes);
      this.spinner.hide();
    })

  }

  filterAttempted(): void {
    this.alltestlist = this.filterTestList.filter((dr: any) =>dr.testtaken === true);
  }

  filterUnattempted(): void {
    this.alltestlist = this.filterTestList.filter((dr: any) => dr.testtaken === undefined);
  }

  clearFilter(): void {
    this.alltestlist = this.filterTestList;
  }

  attemptTestNow(testInfo: any) {
    this.examservice.setPresentExamInfo(testInfo);
    this.router.navigateByUrl('/dashboard/testinstructions');
  }

  viewTestReport(testInfo: any) {
    // this.examservice.setPresentExamInfo(testInfo);
    // this.router.navigateByUrl('/dashboard/viewtestreport');
    this.setExamdataForReport(testInfo);
  }

  timeConvert(n: number) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " h " + rminutes + " m";
  }

  // setExamdataForReport(test: any) {
  //   this.examservice.setPresentExamInfo(this.overallTests);
  //   this.store.store('rules', this.overallTests.rules)
  //   this.store.store('newquestions', test);
  //   this.store.store('examdata', this.overallTests.);
  //   this.store.store('examcountdown', test.);
  //   this.store.store('questiondata', this.overallTests.);
  // }
  setExamdataForReport(test: any) {
    let examInfo: any = {};
    examInfo['examid'] = test.examid;
    examInfo['scheduleid'] = test.scheduleid;
    examInfo['_id'] = test._id;
    examInfo['examsubmittedon'] = test.examsubmittedon;
    // examInfo['issubmitted'] = true;
    // examInfo['isexamstrated'] = false;
    this.studentExamResult && this.studentExamResult.forEach((stdex: any) => {
      if(stdex.ruleid === test._id){
        this.store.store('newquestions', stdex.questionanswer)
        this.store.store('totaltimespend', stdex.totaltimespend)
      }
    })
    this.examservice.setPresentExamInfo(test)
    this.reviewquestions(examInfo);
  }
  reviewquestions(data: any){
    const postdata = {
      scheduleid: data.scheduleid,
      ruleid: data._id,
      createdby: `${this.detail?.mobile}`,
    }
    this.store.clear('examdata');
    this.store.clear('questiondata');
    //this.store.clear('newquestions');
    this.store.clear('defaulttopicIndex');
    this.store.clear('questioncounter');
    this.examservice.postNode('examschedule', postdata).subscribe(
      async resdata => {
        if (resdata.schedule) {
          const examdata = JSON.parse(JSON.stringify(resdata.schedule))
          examdata['examsubmittedon'] = data.examsubmittedon;
          this.store.store('examdata', examdata);
          this.examservice.postNode('examquestions', postdata).subscribe(
            async resdata1 => {
              if (resdata1.questions) {
                console.log('resdata1.questions', resdata1.questions);
                this.store.store('rules', data);

                let questions_: any = [];
                resdata1 && resdata1.questions && resdata1.questions.subjects && resdata1.questions.subjects.forEach((question_:any) => {
                  if(question_.subjectname === 'CHEMISTRY  XI' || question_.subjectname === 'CHEMISTRY  XII' ){
                    if(questions_[0]){
                      questions_[0].questions = questions_[0].questions.concat(this.setSubjectName(question_.questions, 'CHEMISTRY'));
                    } else {
                      question_.subjectname = 'CHEMISTRY'
                      questions_[0] = question_;
                      questions_[0].questions = this.setSubjectName(question_.questions, 'CHEMISTRY');
                    }
                  } else if(question_.subjectname === 'PHYSICS XI' || question_.subjectname === 'PHYSICS XII' ){
                    if(questions_[1]){
                      questions_[1].questions = questions_[1].questions.concat(this.setSubjectName(question_.questions, 'PHYSICS'));
                    } else {
                      question_.subjectname = 'PHYSICS'
                      questions_[1] = question_;
                      questions_[1].questions = this.setSubjectName(question_.questions, 'PHYSICS');
                    }
                  } else if(question_.subjectname === 'BOTANY XI' || question_.subjectname === 'BOTANY XII' || question_.subjectname === 'ZOOLOGY XI' || question_.subjectname === 'ZOOLOGY XII' ){
                    if(questions_[2]){
                      questions_[2].questions = questions_[2].questions.concat(this.setSubjectName(question_.questions, 'BIOLOGY'));
                    } else {
                      question_.subjectname = 'BIOLOGY'
                      questions_[2] = question_;
                      questions_[2].questions = this.setSubjectName(question_.questions, 'BIOLOGY');
                    }
                  }
                  
                })
                resdata1.questions.subjects = questions_;
                this.store.store('questiondata', resdata1.questions);
                this.router.navigate(['/dashboard/viewtestreport']);
              } else {

              }
            },
            async () => { },
          )



        } else {
          // this.spinner.hide();
          // this.notification.warning('Warning', 'No Questions Found');
        }
      },
      async () => { },
    )
  }

  showMyProfile() : void {
    this.router.navigate(['myprofile']);
  }

  logout() : void {
    localStorage.clear();
    this.router.navigate(['']);
  } 
  setSubjectName(questions: any, subname: string): any {
    questions && questions.length> 0 && questions.forEach((ques: any) => {
      ques.subjectname = subname;
    })

    return questions;
  }
}
