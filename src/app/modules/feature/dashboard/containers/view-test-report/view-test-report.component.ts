import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { ExamService } from '../../../../../services/test/exam.service';
import { TestlistService } from '../../../../../services/test/testlist.service';
@Component({
  selector: 'app-view-test-report',
  templateUrl: './view-test-report.component.html',
  styleUrls: ['./view-test-report.component.css']
})
export class ViewTestReportComponent implements OnInit {
  answeredQuestions: any;
  examdata: any;
  token: any;
  alltestlist = [];
  constructor(private examservice: ExamService,
    private store: LocalStorageService,
    private router: Router,
    private testListService: TestlistService,
    private spinner: NgxSpinnerService
  ) { }


  averageScore: any = 90;
  cutOffScore: any = 70;
  examinfo: any;
  rules: any;
  questiondata: any;
  scorePerQuestion: any = 4;
  negetiveScorePerQuestion: any = 1;
  testReport: any = {
    testname: '',
    totaltimespentinhrs:'',
    accuracy: 0,
    bestSubject: '',
    scopeOfImprovement: '',
    bestChapter: '',
    scopeOfImprovementChapter: '',
    correctAnswer: 0,
    incorrectAnswer: 0,
    unAttemptedQuestions: 0,
    totalQuestions: 0,
    totalVisitedQuestions: 0,
    totalVisitedTimes: 0,
    averageTimePerQuestion: 0,
    testSubjects: [],
    overallChartData: {
        labels: ['Correct', 'Incorrect', 'Unattempted'],
        data: [0,0,0] 
    }
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.examinfo = this.examservice.getPresentExamInfo();
    if (!this.examinfo) {
      this.router.navigateByUrl('/dashboard')
    }
    this.rules = this.store.retrieve('rules');
    this.answeredQuestions = this.store.retrieve('newquestions');
    let examdata = this.store.retrieve('examdata');
    let totaltimespend = this.store.retrieve('totaltimespend');
    this.questiondata = this.store.retrieve('questiondata');
    
    this.examdata = examdata;

    let examinfo = this.store.retrieve('examinfo');
    this.testReport.testname = examinfo.rulename;


    this.answeredQuestions.forEach((subject: any) => {
      subject.questions.forEach((question: any) => {
        if (question.iscorrectanswer === 'Y') {
          this.testReport.correctAnswer++;
        } else if (question.iscorrectanswer === 'N') {
          this.testReport.incorrectAnswer++;
        } else {
          this.testReport.unAttemptedQuestions++;
        }

        if (question.is_visited || question.answer_given || question.ismarkedforreview) {
          this.testReport.totalVisitedQuestions++
        }
        if (question.visitedtime) {
          this.testReport.totalVisitedTimes = this.testReport.totalVisitedTimes + question.visitedtime;
        }

        this.testReport.totalQuestions++;
      });
      this.testReport.accuracy = (this.testReport.correctAnswer / (this.testReport.correctAnswer+this.testReport.incorrectAnswer)) * 100;
      this.testReport.overallChartData.data = [this.testReport.correctAnswer,this.testReport.incorrectAnswer,this.testReport.unAttemptedQuestions];
      this.addSubjectWiseReport(subject);
    });

    this.testReport.averageTimePerQuestion = this.testReport.totalVisitedTimes / this.testReport.totalVisitedQuestions;
    this.testReport.totaltimespentinhrs = this.timeConvert(totaltimespend);
    
    /* search for best subjects and chapters */
    if (this.testReport.testSubjects.length) {
      let subjectArray = this.testReport.testSubjects;
      subjectArray.sort((a: any, b: any) => {

        let aMaxPercentForBest = (a.accuracy+a.totalScore)-(a.totalVisitedTime/a.totalVisitedQuestions);
        let bMaxPercentForBest = (b.accuracy+b.totalScore)-(b.totalVisitedTime/b.totalVisitedQuestions);
        return bMaxPercentForBest - aMaxPercentForBest;
      });

      this.testReport.bestSubject = subjectArray[0].subjectName;
      this.testReport.scopeOfImprovement = subjectArray[subjectArray.length-1].subjectName;

      this.testReport.bestChapter=subjectArray[0].bestChapters[0].chapter
      this.testReport.scopeOfImprovementChapter = subjectArray[subjectArray.length - 1].bestChapters.reverse()[0].chapter;

    }



  }

  addSubjectWiseReport(subject: any) {
    
    let totalQuestions = subject.questions.length;
    let totalCorrectQuestions = subject.questions.filter((question:any) => {
      return question.iscorrectanswer === 'Y';
    }).length;
    let totalInCorrectQuestions = subject.questions.filter((question:any) => {
      return question.iscorrectanswer === 'N';
    }).length;
    let totalUnAttemptedQuestions = subject.questions.filter((question:any) => {
      return !question.iscorrectanswer;
    }).length;

    let totalVisitedQuestions = subject.questions.filter((question:any) => {
      return question.is_visited || question.answer_given || question.ismarkedforreview;
    }).length;

    /* time taken for all visited questions */
    let totalVisitedTime = subject.questions.reduce((totalVisitedTime:any,question:any) => {
      if (question.visitedtime) {
        return totalVisitedTime + question.visitedtime
      } else {
        return totalVisitedTime+0
      }
    }, 0);

    /* time taken for attempted questions */
    let totalTimeForAttemptedQuestions = subject.questions.reduce((totalVisitedTime:any,question:any) => {
      if (question.visitedtime && question.iscorrectanswer) {
        return totalVisitedTime + question.visitedtime
      } else {
        return totalVisitedTime+0
      }
    }, 0);
    
    /* code for chapter related data */
    var chaptersArray: Array<any> = [];
    subject.questions.forEach((question: any) => {
      const chapterAlreadyAddedIndex = chaptersArray.map((chapterObject) => {
        return chapterObject.chapter;
      }).indexOf(question.chapter);

      /* chapterAlreadyAddedIndex>=0 i.e != -1 that means chapter already in chaptersArray */
      if (chapterAlreadyAddedIndex >= 0) {
        let addedChapterData = chaptersArray[chapterAlreadyAddedIndex];

        let chapterData:any = {
          chapter: question.chapter,
          totalQuestions: addedChapterData.totalQuestions+1,
          totalAttemptedQuestions: (question.iscorrectanswer) ? addedChapterData.totalAttemptedQuestions+1 : addedChapterData.totalAttemptedQuestions,
          totalUnattempted: (!question.iscorrectanswer) ? addedChapterData.totalUnattempted+1 : addedChapterData.totalUnattempted,
          correctQuetions: (question.iscorrectanswer == 'Y') ? addedChapterData.correctQuetions+1 : addedChapterData.correctQuetions,
          incorrectQuetions: (question.iscorrectanswer == 'N') ? addedChapterData.incorrectQuetions+1 : addedChapterData.incorrectQuetions,
          totalVisitedTime: question.visitedtime ? (addedChapterData.totalVisitedTime + question.visitedtime) : (addedChapterData.totalVisitedTime + 0),
          totalVisitedTimeForAttemptedQuestions:(question.iscorrectanswer && question.visitedtime)?(addedChapterData.totalVisitedTimeForAttemptedQuestions + question.visitedtime) :(addedChapterData.totalVisitedTimeForAttemptedQuestions + 0),
          totalScore: 0,
          accuracy: 0,
          avgTime: 0,
          avgTimeForAttemptedQuestion:0
        }

        /* updating added chapter data */
        chaptersArray[chapterAlreadyAddedIndex] = chapterData;

      } else {

        let chapterData:any = {
          chapter: question.chapter,
          totalQuestions: 1,
          totalAttemptedQuestions: (question.iscorrectanswer) ? 1 : 0,
          totalUnattempted: (!question.iscorrectanswer) ? 1 : 0,
          correctQuetions: (question.iscorrectanswer == 'Y') ? 1 : 0,
          incorrectQuetions: (question.iscorrectanswer == 'N') ? 1 : 0,
          totalVisitedTime: question.visitedtime ? question.visitedtime : 0,
          totalVisitedTimeForAttemptedQuestions:(question.iscorrectanswer && question.visitedtime)?question.visitedtime :0,
          totalScore: 0,
          accuracy: 0,
          avgTime: 0,
          avgTimeForAttemptedQuestion:0
        }
        chaptersArray.push(chapterData);

      }
    });

    //if there are chapters then loop all the chapters and calculate chapters totalScore & accuracy & avgTime & avgTimeForAttemptedQuestion
    if (chaptersArray.length) {
      chaptersArray = chaptersArray.map((singleChapter) => {
        let totalScore=((singleChapter.correctQuetions * this.scorePerQuestion)-(singleChapter.incorrectQuetions * this.negetiveScorePerQuestion))
        return {
          ...singleChapter,
          totalScore: totalScore,
          accuracy: ((singleChapter.correctQuetions / singleChapter.totalAttemptedQuestions) * 100),
          avgTime: (singleChapter.totalVisitedTime / singleChapter.totalQuestions),
          avgTimeForAttemptedQuestion:(singleChapter.totalVisitedTimeForAttemptedQuestions/singleChapter.totalAttemptedQuestions)
        }
      })
    }


    let bestChapters = chaptersArray.filter((chapter) => {
      return chapter.totalAttemptedQuestions > 0
    });;
    bestChapters.sort((a, b) => {
      let aMaxPercentForBest = (a.accuracy+a.totalScore)-(a.totalVisitedTime/a.totalQuestions);
      let bMaxPercentForBest = (b.accuracy+b.totalScore)-(b.totalVisitedTime/b.totalQuestions);
      return bMaxPercentForBest - aMaxPercentForBest;
    });

    /* Chapter related logic ends here */
    var logo = "";
    if (subject.subjectname.toLowerCase()=='physics') {
      logo = "assets/img/physics-icon.svg";
    } else if (subject.subjectname.toLowerCase()=='chemistry') {
      logo = "assets/img/chemistry-icon.svg";
    } else if (subject.subjectname.toLowerCase() == 'biology') {
      logo = "assets/img/biology-icon.svg";
    }


    let subjectData = {
      subjectName: subject.subjectname,
      subjectLogo:logo,
      subjectId: subject.subjectId,
      totalQuestions: totalQuestions,
      totalCorrectQuestions: totalCorrectQuestions,
      totalInCorrectQuestions: totalInCorrectQuestions,
      totalAttemptedQuestions:(totalCorrectQuestions+totalInCorrectQuestions),
      totalUnAttemptedQuestions: totalUnAttemptedQuestions,
      totalVisitedQuestions: totalVisitedQuestions,
      totalVisitedTime: totalVisitedTime,
      totalTimeForAttemptedQuestions:totalTimeForAttemptedQuestions,
      accuracy:((totalCorrectQuestions/totalQuestions)*100),
      totalScore: (totalCorrectQuestions * this.scorePerQuestion - totalInCorrectQuestions * this.negetiveScorePerQuestion),
      chartData:{
        labels: ['Correct', 'Incorrect', 'Unattempted'],
        data: [totalCorrectQuestions,totalInCorrectQuestions,totalUnAttemptedQuestions] 
      },
      chapters: chaptersArray,
      bestChapters: bestChapters,
      
    }

    this.testReport.testSubjects.push(subjectData);

  }



  getTimeDetails(time_in_seconds: any) {
    
    time_in_seconds = parseInt(time_in_seconds);
    if (time_in_seconds > 0) {
      let time_details = new Date(time_in_seconds * 1000).toISOString().substr(11, 8);
      var time_details_array = time_details.split(":");
      if (time_details_array[0] != '00') {

        let hour = (parseInt(time_details_array[0]) >= 10) ? time_details_array[0] : time_details_array[0].substring(1, 2);
        let min  = (parseInt(time_details_array[1]) >= 10) ? time_details_array[1] : time_details_array[1].substring(1, 2);
        return hour + " h " + min + " m";
        
      } else {
        
        let min  = (parseInt(time_details_array[1]) >= 10) ? time_details_array[1] : time_details_array[1].substring(1, 2);
        let sec = (parseInt(time_details_array[2]) >= 10) ? time_details_array[2] : time_details_array[2].substring(1, 2);
        return min + " m " + sec + " s";
      }
      
    } else {
      return '0 m 0 s';
    }

    
  }

  timeConvert(n: number) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " h " + rminutes + " m";
  }

  clearExamData() {
    this.store.clear('examcountdown');
    this.store.clear('examinfo');
    this.store.clear('examdata');
    this.store.clear('rules');
    this.store.clear('questiondata');
    this.store.clear('newquestions');
  }

  takeAnotherTest() {
    // this.store.store('examinfo', this.examinfo)
    // this.store.store('rules', this.rules);
    // this.store.store('examdata', this.examdata);
    // this.store.store('questiondata', this.questiondata);
    //this.router.navigateByUrl('/dashboard/testinstructions')

    if (this.examinfo.examtype == 'MOCKTEST') {
      
     
    let _headers = {
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'methodtype': 'RULES'
    };
    this.spinner.show();
    this.testListService.getPreviousAndPresentMockTests(_headers).subscribe((overallTests: any) => {
      console.log(overallTests,'overallTests')
      let test_=[];
      if (this.examinfo.examtype === 'MOCKTEST') {
        test_ = overallTests.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN');
      } else {
        test_ = overallTests.filter((dr: any) => dr.examtype !== 'MOCKTEST' && dr.examtype !== 'JEEMAIN');
      }

      this.alltestlist = test_;

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
      let test_=[];
      if (this.examinfo.examtype=== 'MOCKTEST') {
        test_ = allTestsbyStudent.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN');
      } else {
        test_ = allTestsbyStudent.filter((dr: any) => dr.examtype !== 'MOCKTEST' && dr.examtype !== 'JEEMAIN');
      }

      test_.forEach((test: any) => {
        this.alltestlist.forEach((testrow: any) => {
          if (testrow._id === test.ruleid) {
            testrow.testtaken = true
          }
        })
      });

      let notAttemptedTest = this.alltestlist.filter((test: any) => !test.testtaken);
      this.spinner.hide();
      if (notAttemptedTest.length) {
        this.examservice.setPresentExamInfo(notAttemptedTest[0]);
        this.router.navigateByUrl('/dashboard/testinstructions');
      } else {
        this.router.navigateByUrl('/dashboard/testlist?examtype=MOCKTEST');
      }
      
    }, err => {
      this.spinner.hide();
      this.router.navigateByUrl('/dashboard/testlist?examtype=MOCKTEST');
    })


    }, err => {
      this.spinner.hide();
      this.router.navigateByUrl('/dashboard/testlist?examtype=MOCKTEST');
    })

      
    } else {
      this.router.navigateByUrl('/dashboard/testlist')
    }

  }

  viewSolutions(subject?: any) {
    subject = subject ? `?subject=${subject}`: ''
    this.store.store('examinfo', this.examinfo)
    this.store.store('rules', this.rules);
    this.store.store('newquestions', this.answeredQuestions);
    this.store.store('examdata', this.examdata);
    this.store.store('questiondata', this.questiondata);
    this.store.clear('defaulttopicIndex');
    this.store.clear('questioncounter');
    this.router.navigateByUrl('/dashboard/viewsolutionspage'+subject)
  }



  viewfullsolution() {
    this.router.navigateByUrl('#/dashboard/viewsolutionspage');
  }

}
