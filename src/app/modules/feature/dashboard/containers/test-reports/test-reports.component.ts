import { Component, OnInit } from '@angular/core';
import { TestlistService } from '../../../../../services/test/testlist.service';
import { UserService } from '@app-services/user/user.service';
import { Router } from '@angular/router';
import { ExamService } from '../../../../../services/test/exam.service';
import { ApiUrlConstant } from '@app-constants/api-url.constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewDetailedReportComponent } from './view-detailed-report/view-detailed-report.component';

@Component({
  selector: 'app-test-reports',
  templateUrl: './test-reports.component.html',
  styleUrls: ['./test-reports.component.css']
})
export class TestReportsComponent implements OnInit {

  subjects = [
    {
      logo: 'assets/img/chemistry-icon.svg',
      heading: 'Chemistry',
      events: [
        {
          logo: 'assets/img/best-chapter-icon.svg',
          headtext: 'Best Chapter',
          description: 'D-Block Elements'
        },
        {
          logo: 'assets/img/scope-of-improvement-icon.svg',
          headtext: 'Scope of improvement',
          description: 'Atomic Structure'
        },
        {
          logo: 'assets/img/average-score-icon.svg',
          headtext: 'Average Score',
          description: '150 / 180'
        },

      ],
      link: {
        label: 'VIEW DETAILED REPORT',
        route: ''
      }
    },
    {
      logo: 'assets/img/physics-icon.svg',
      heading: 'Physics',
      events: [
        {
          logo: 'assets/img/best-chapter-icon.svg',
          headtext: 'Best Chapter',
          description: 'D-Block Elements'
        },
        {
          logo: 'assets/img/scope-of-improvement-icon.svg',
          headtext: 'Scope of improvement',
          description: 'Atomic Structure'
        },
        {
          logo: 'assets/img/average-score-icon.svg',
          headtext: 'Average Score',
          description: '150 / 180'
        },

      ],
      link: {
        label: 'VIEW DETAILED REPORT',
        route: ''
      }
    }, {
      logo: 'assets/img/biology-icon.svg',
      heading: 'Biology',
      events: [
        {
          logo: 'assets/img/best-chapter-icon.svg',
          headtext: 'Best Chapter',
          description: 'D-Block Elements'
        },
        {
          logo: 'assets/img/scope-of-improvement-icon.svg',
          headtext: 'Scope of improvement',
          description: 'Atomic Structure'
        },
        {
          logo: 'assets/img/average-score-icon.svg',
          headtext: 'Average Score',
          description: '150 / 180'
        },

      ],
      link: {
        label: 'VIEW DETAILED REPORT',
        route: ''
      }
    },
  ]

  selectedfilter: any = '1month'
  filters: any[] = [
    {
      name: '1 Week',
      id: '1week'
    },
    {
      name: '15 Days',
      id: '15days'
    },
    {
      name: '1 Month',
      id: '1month'
    },
    {
      name: '3 Months',
      id: '3months'
    },
    {
      name: '6 Months',
      id: '6months'
    },
    {
      name: '1 Year',
      id: '1year'
    }
  ]
  apiUrl = ApiUrlConstant.examUrl;
  chaptersList: any = {};
  selectedReportType: any = 'Mock Tests';
  report: any = [];
  detail: any;
  token: any;
  tempreport: any[] = [];
  allTestsbyStudent: any;
  cumilativeChartData: any;
  constructor(private testListService: TestlistService, private userService: UserService,
    public router: Router, private examSerivce: ExamService,
    private dialog: MatDialog) {
    this.token = localStorage.getItem('token')
    this.detail = this.userService.getMobileAndName();
    this.getsubjects();
  }

  ngOnInit(): void {

    let overallTests_: any = [];
    let _headers = {
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'methodtype': 'RULES'
    };
    this.testListService.getPreviousAndPresentMockTests(_headers).subscribe((overallTests: any) => {

      overallTests_ = overallTests;
    })


    let _headers_for_Exam = {
      'methodtype': 'GETTESTS',
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'Content-Type': 'application/json'
    };
    let _body_for_exam_result = {
      'studentid': localStorage.getItem('studentid'),
      "scheduleid": "null",
      "ruleid": "null"
    }
    let allTestsbyStudent_;
    this.testListService.getStudentExamResult(_body_for_exam_result, _headers_for_Exam).subscribe((allTestsbyStudent: any) => {
      allTestsbyStudent_ = allTestsbyStudent;
      this.generateReport(overallTests_, allTestsbyStudent_);
    });

    // this.report

  }

  generateReport(overallTests_: any, allTestsbyStudent: any) {
    // console.log('all tests data by a student', allTestsbyStudent);
    this.report['avgscore'] = 0
    this.report['avgtimespent'] = 0
    this.report['pypattempted'] = 0
    this.report['mocktestsattempted'] = 0
    this.report['totalpyptests'] = 0;
    this.report['totalmocktests'] = 0;

    allTestsbyStudent.forEach((test_: any) => {
      this.report['avgtimespent'] += Number(test_.totaltimespend);
      this.report['avgscore'] += Number(test_.score);
      if (test_.examtype === 'MOCKTEST') {
        this.report['mocktestsattempted']++;
      } else {
        this.report['pypattempted']++;
      }
    });
    overallTests_.forEach((test_: any) => {
      if (test_.examtype === 'MOCKTEST') {
        this.report['totalmocktests']++;
      } else {
        this.report['totalpyptests']++;
      }
    });

    this.report['avgscore'] = this.report['avgscore'] / allTestsbyStudent.length;
    this.report['avgscore'] = parseInt(this.report['avgscore']);
    this.report['avgtimespent'] = this.report['avgtimespent'] / allTestsbyStudent.length;
    this.report['avgtimespent'] = this.timeConvert(parseInt(this.report['avgtimespent']));

    if (this.selectedReportType === 'Mock Tests') {
      overallTests_ = overallTests_.filter((dr: any) => dr.examtype === 'MOCKTEST');
      allTestsbyStudent = allTestsbyStudent.filter((dr: any) => dr.examtype === 'MOCKTEST');
    } else {
      overallTests_ = overallTests_.filter((dr: any) => dr.examtype !== 'MOCKTEST');
      allTestsbyStudent = allTestsbyStudent.filter((dr: any) => dr.examtype !== 'MOCKTEST');
    }



    this.selectedTestReport(overallTests_, allTestsbyStudent)
  }

  selectedTestReport(overallTests_: any, allTestsbyStudent: any) {
    this.report['favgscore'] = 0
    this.report['favgtimespent'] = 0
    this.report['fpypattempted'] = 0
    this.report['fmocktestsattempted'] = 0
    this.report['ftotalmocktests'] = !!overallTests_ && overallTests_.length;
    let subjects_: any = {};
    this.allTestsbyStudent = allTestsbyStudent;
    this.cumilativeChartData = this.prepareDataForCumilativeChart(this.allTestsbyStudent);
    allTestsbyStudent.forEach((test: any) => {
      test.questionanswer && test.questionanswer.forEach((qa: any) => {

        if (!this.report[qa.subjectname]) {
          subjects_[qa.subjectname] = {};
        }
        subjects_[qa.subjectname]['subjectId'] = qa.subjectId;
        subjects_[qa.subjectname]['score'] = 0;
        subjects_[qa.subjectname]['count'] = 0;
        subjects_[qa.subjectname]['bestchapter'] = {}
        subjects_[qa.subjectname]['scopeofimprovement'] = {};
        subjects_[qa.subjectname]['chapter'] = {}
        subjects_[qa.subjectname]['correctanswercount'] = 0;
        subjects_[qa.subjectname]['wronganswercount'] = 0;
        subjects_[qa.subjectname]['totaltimespent'] = test.totaltimespend;
        subjects_[qa.subjectname]['examsubmittedon'] = test.examsubmittedon;
        qa.questions.forEach((ques: any) => {
          if (ques.iscorrectanswer === 'Y') {
            subjects_[qa.subjectname]['correctanswercount']++;
            subjects_[qa.subjectname]['score']++;
            if (ques.chapter) {
              if (!subjects_[qa.subjectname]['bestchapter'][ques.chapter]) { subjects_[qa.subjectname]['bestchapter'][ques.chapter] = {correct: 0, wrong: 0, count: 0, timespent: 0}; }
              if (!subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter]) { subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter] = {correct: 0, wrong: 0, count: 0, timespent: 0}; }
              subjects_[qa.subjectname]['bestchapter'][ques.chapter]['correct']++;
              subjects_[qa.subjectname]['bestchapter'][ques.chapter]['count']++;
              subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter]['correct']++;
              subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter]['count']++;
            }
          } else if (ques.iscorrectanswer === 'N') {
            subjects_[qa.subjectname]['wronganswercount']++;
            if (ques.chapter) {
              if (!subjects_[qa.subjectname]['bestchapter'][ques.chapter]) { subjects_[qa.subjectname]['bestchapter'][ques.chapter] = {correct: 0, wrong: 0, count: 0, timespent: 0}; }
              if (!subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter]) { subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter] = {correct: 0, wrong: 0, count: 0, timespent: 0}; }
              subjects_[qa.subjectname]['bestchapter'][ques.chapter]['wrong']++;
              subjects_[qa.subjectname]['bestchapter'][ques.chapter]['count']++;
              subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter]['wrong']++;
              subjects_[qa.subjectname]['scopeofimprovement'][ques.chapter]['count']++;
            }
          }
          subjects_[qa.subjectname]['count']++;

        })

        // -- Best Chapters
        let chapternames = Object.keys(subjects_[qa.subjectname]['bestchapter']);
        let subjectwiseBestchapter: any = [];

        chapternames && chapternames.forEach((chapter: any) => {
          subjectwiseBestchapter.push({
            chaptername: chapter,
            count: subjects_[qa.subjectname]['bestchapter'][chapter]['count'],
            correct: subjects_[qa.subjectname]['bestchapter'][chapter]['correct'],
            wrong: subjects_[qa.subjectname]['bestchapter'][chapter]['wrong'],
            timespent: subjects_[qa.subjectname]['bestchapter'][chapter]['timespent']
          })
        });
        subjectwiseBestchapter = subjectwiseBestchapter.sort((a: any, b: any) => (((a.correct -a.wrong)/(a.correct + a.wrong)) < ((b.correct -b.wrong)/(b.correct + b.wrong))) ? 1 : ((((b.correct -b.wrong)/(b.correct + b.wrong)) < ((a.correct -a.wrong)/(a.correct + a.wrong))) ? -1 : 0))
        subjects_[qa.subjectname]['bestchapter'] = subjectwiseBestchapter.slice(0, 3);

        // -- Scope of Improvement

        chapternames = Object.keys(subjects_[qa.subjectname]['scopeofimprovement']);
        let scopeofimprovement: any = [];

        chapternames && chapternames.forEach((chapter: any) => {
          scopeofimprovement.push({
            chaptername: chapter,
            count: subjects_[qa.subjectname]['scopeofimprovement'][chapter]['count'],
            correct: subjects_[qa.subjectname]['scopeofimprovement'][chapter]['correct'],
            wrong: subjects_[qa.subjectname]['scopeofimprovement'][chapter]['wrong'],
            timespent: subjects_[qa.subjectname]['scopeofimprovement'][chapter]['timespent']
          })
        });
        scopeofimprovement = scopeofimprovement.sort((a: any, b: any) => (((a.correct -a.wrong)/(a.correct + a.wrong)) > ((b.correct -b.wrong)/(b.correct + b.wrong))) ? 1 : ((((b.correct -b.wrong)/(b.correct + b.wrong)) > ((a.correct -a.wrong)/(a.correct + a.wrong))) ? -1 : 0))
        subjects_[qa.subjectname]['scopeofimprovement'] = scopeofimprovement.slice(0, 3);
        // console.log('scopeofimprovement - - ', scopeofimprovement)
      })
      this.report['favgtimespent'] += Number(test.totaltimespend);
      this.report['favgscore'] += Number(test.score);
    });

    this.report['calculatedSubs'] = [];
    let subs = Object.keys(subjects_);
    subs.forEach((sub: any) => {
      this.subjects.forEach((staticSub: any) => {
        if (staticSub.heading.toUpperCase() === sub.toUpperCase()) {
  
          this.report['calculatedSubs'].push({
            subject: sub,
            subjectmetadata: subjects_[sub],
            logo: staticSub.logo,
            details: [{
              logo: 'assets/img/best-chapter-icon.svg',
              headtext: 'Best Chapter',
              description: subjects_[sub]['bestchapter'][0] && subjects_[sub]['bestchapter'][0].chaptername
            },
            {
              logo: 'assets/img/scope-of-improvement-icon.svg',
              headtext: 'Scope of improvement',
              description: subjects_[sub]['scopeofimprovement'][0] && subjects_[sub]['scopeofimprovement'][0].chaptername
            },
            {
              logo: 'assets/img/average-score-icon.svg',
              headtext: 'Average Score',
              description: parseInt('' + ((subjects_[sub]['correctanswercount'] * 4) - subjects_[sub]['wronganswercount']) / allTestsbyStudent.length) + ' / ' + (subjects_[sub]['count'] * 4)
            }],
  
          })
        }
      })
      let chapterheader_ = {
        'methodtype': 'CHAPTER',
        'accesstoken': this.token,
        'studentid': localStorage.getItem('studentid'),
        'Content-Type': 'application/json'
      }
      const url = this.apiUrl + `validatestudenttoken`;
      this.examSerivce.getByHeader(url, { 'subjectid': subjects_[sub]['subjectId'] }, chapterheader_).subscribe(
        async resdata => {
          resdata && resdata.forEach((chapter:any) => {
            this.chaptersList[chapter.chaptercode] = chapter.chaptername
          });
          // console.log('resdata ---', resdata);
          this.tempreport = [];
          this.report['calculatedSubs'] && this.report['calculatedSubs'].length > 0 && this.report['calculatedSubs'].forEach((calsub: any) => {
            calsub['details'][0]['description'] && this.chaptersList[calsub['details'][0]['description']] && (calsub['details'][0]['description'] = this.chaptersList[calsub['details'][0]['description']])
            calsub['details'][1]['description'] && this.chaptersList[calsub['details'][1]['description']] && (calsub['details'][1]['description'] = this.chaptersList[calsub['details'][1]['description']])
            this.tempreport.push(calsub)
          })
          this.tempreport = this.prepareDataForsubjectChart(this.tempreport)
          this.report['calculatedSubs'] = this.tempreport;
          // console.log("this.report['calculatedSubs']", this.tempreport)
          // this.examSerivce.getByHeader(url, { 'subjectid': Object.keys(subjects_[sub]['scopeofimprovement'])[0] }, chapterheader_).subscribe(
          //   async resdata2 => {
          //     // console.log('subjects', resdata2);
          //   },
          //   async () => { },
          // )
        },
        async () => { },
      )

    })

    this.report['favgscore'] = this.report['favgscore'] / allTestsbyStudent.length;
    this.report['favgscore'] = parseInt(this.report['favgscore']);
    this.report['favgtimespent'] = this.report['favgtimespent'] / allTestsbyStudent.length;
    this.report['favgtimespent'] = this.timeConvert(parseInt(this.report['favgtimespent']));
    this.report['fmocktestsattempted'] = allTestsbyStudent.length;
  }

  selectReportType(type_: any): any {
    this.selectedReportType = type_;
  }

  timeConvert(n: number) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return  rhours + " h " + rminutes + " m";
  }

  showMyProfile(): void {
    this.router.navigate(['myprofile']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  getsubjects() {
    let header_ = {
      'methodtype': 'SUBJECT',
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'Content-Type': 'application/json'
    }
    const url = this.apiUrl + `validatestudenttoken`;
    this.examSerivce.getByHeader(url, {}, header_).subscribe(
      async resdata => {
        // console.log('chapters', resdata)
        this.getchapters('6052ebeaa83b57668d146894');
      },
      async () => { },
    )
  }

  getchapters(subjectid: any) {
    let chapterheader_ = {
      'methodtype': 'CHAPTER',
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'Content-Type': 'application/json'
    }
    const url = this.apiUrl + `validatestudenttoken`;
    this.examSerivce.getByHeader(url, { 'subjectid': subjectid }, chapterheader_).subscribe(
      async resdata => {
        // console.log('subjects', resdata)
      },
      async () => { },
    )
  }

  viewdetailedreport(subject: any, calculatedSubs: any, chaptersList_: any) {
    const config: MatDialogConfig = {
      width: '950px',
      //height: '826px',
      data: { subject: subject, calculatedSubs: calculatedSubs,  chaptersList: chaptersList_, allTestsbyStudent: this.allTestsbyStudent}
    };
    const dialogRef = this.dialog.open(ViewDetailedReportComponent, config);
  }

  prepareDataForCumilativeChart(examDetails: any): any{
    console.log('examDetails', examDetails);
    let chartDataList: any = [];
    let labels: any = [];
    let cdata: any = {  data: [], label: '',  barThickness: 15, backgroundColor:'#54eab7' }
    examDetails && examDetails.forEach((exam: any) => {
      cdata.data.push(exam.score);
      let examdate = new Date(exam.examsubmittedon)
      // console.log('day ',examdate.getDate())
      cdata.label = exam.examtype;
      labels.push(''+examdate.getDate());
    })
    chartDataList.push(cdata);
   return {chartDataList: chartDataList, labels: labels};
  }

  prepareDataForsubjectChart(examDetails: any): any{
    console.log('examDetails', examDetails);
    let cdata: any = {  data: [], label: '',  barThickness: 15, backgroundColor:'#54eab7' }
    examDetails && examDetails.forEach((exd: any)=> {
      let chartDataList: any = [];
      let labels: any = [];
        cdata.data.push(exd.subjectmetadata.score);
        let examdate = new Date(exd.subjectmetadata.examsubmittedon)
        // console.log('day ',examdate.getDate())
        cdata.label = exd.subject;
        labels.push(''+examdate.getDate());
        chartDataList.push(cdata);
        exd['chartdata'] = {chartDataList: chartDataList, labels: labels};
    })
   return examDetails;
  }

}
