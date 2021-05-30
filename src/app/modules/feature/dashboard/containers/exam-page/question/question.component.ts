import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { AlertController, IonSlides, NavController } from '@ionic/angular';
//import { ExamService } from 'src/services/exam.service';
//import { Storage } from '@ionic/storage';
//import { ToastService } from 'src/services/toastr.service';
//import { LoaderService } from 'src/services/LoaderService';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { ExamService } from '../../../../../../services/test/exam.service';
import { UserService } from '@app-services/user/user.service';
// import * as Editor from 'src/app/pages/customers/ckeditor/ckeditor';
declare var swal: any;

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  // public Editor = Editor
  question: any;
  questioncounter = 0;
  btnvar = "btn";
  classvar = "d-flex previous_btn";
  content: any;
  topics: any = [];
  exam: any = {
    duration: 0,
    totalquestions: 0
  };
  timer: any;
  questionchoices: any = [];
  questionselected = 0;
  allquestions: any = [];
  defaulttopic = '';
  noquestions = true;
  examcountdown: any = 0;
  studentId: any = '';
  examschedule_id: any = 0;
  subjectid: any = 0;
  showcounter: any = 0;
  newselectionarray: any = [];
  issubmission = false;
  correctanswerscount = 0;
  attemptedsummary: any = [];
  numericvalue = "";
  changequestions: Array<any> = [];
  svData: any[] = [];
  role = null;
  userObj: any;
  rulesdata: any;
  stateForm: FormGroup;
  selectedQuestions: any;
  questionIntervalCount: any;
  questionTimeCount: number = 0;
  detail: any;
  token: any;
  previousButtonDisable = true;
  nextButtonDisable = false;
  addNumberToCounterForDisplayNumber = 0;
  constructor(
    private storage: LocalStorageService,
    private route: Router,
    private modalService: NgbModal,
    private examService: ExamService,
    private router: Router,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private userService: UserService) {
    this.token = localStorage.getItem('token')
    this.detail = this.userService.getMobileAndName()
    this.role = this.storage.retrieve('ROLE');
    this.userObj = this.storage.retrieve('userDetails');
    if (this.storage.retrieve('attemptedsummary') != null) {
      this.attemptedsummary = this.storage.retrieve('attemptedsummary');
    }

    if (this.storage.retrieve('questioncounter') != null) {
      this.questioncounter = this.storage.retrieve('questioncounter');
      this.showcounter = this.questioncounter;
    } else {
      this.questioncounter = 0;
      this.storage.store('questioncounter', 0);
      this.showcounter = 0;
    }

    let examdata = this.storage.retrieve('examdata');
    this.exam = examdata;

    this.topics = [
      { name: "PHYSICS" },
      { name: "CHEMISTRY" },
      { name: "BIOLOGY" }
    ];

    if (this.storage.retrieve('defaulttopic') != null) {
      this.defaulttopic = this.storage.retrieve('defaulttopic');
    } else {
      this.defaulttopic = "PHYSICS";
      this.storage.store('defaulttopic','PHYSICS');
    }


    let questionTimeCount=this.storage.retrieve('questionTimeCount');
    if (questionTimeCount) {
      this.updateTimeTakenQuestionWise(this.questioncounter, this.defaulttopic, questionTimeCount);
    }

    this.updateDisplayCounterIndex(this.defaulttopic);

    this.loadquestions();
    this.rulesdata = this.storage.retrieve('rules');

    this.stateForm = this.fb.group({
      subject: [null],
      chapter: [null],
      testtype: [null],
      pretype: [null],
    });

    this.examService.submitExamFromHeader.subscribe((examinfo: any) => {
      //console.log('submit Exam')
      this.submitexam();
    });

    this.examService.showQuestionByNumber.subscribe((questionNumber: any) => {
      //console.log('show selected Question')
      // this.showcounter = questionNumber - 1;
      // this.questioncounter = questionNumber - 1;
      // this.swipeNext();
      this.updateTimeTakenQuestionWise(this.questioncounter, this.defaulttopic);
      
      this.showcounter = questionNumber;
      this.questioncounter = questionNumber;
      this.markAsVisited('');
      this.loadquestions();
      this.storage.store('questioncounter', this.questioncounter);
      this.checkPreviousAndBackButtonsDisabality();
    });

    this.checkPreviousAndBackButtonsDisabality();
  }

  ngOnInit() {
    document.body.style.setProperty('--my-var', 'option rigt_answers');
    this.newselectionarray = this.storage.retrieve('newquestions') || [];
    this.closeinterval();
    this.startQuestionCount();
  }

  changetopics(top: any, questioncounter: any = 0) {

    /*code for display number of questions */
    this.updateDisplayCounterIndex(top.name);

    this.closeinterval();
    this.startQuestionCount();
    this.updateTimeTakenQuestionWise(this.questioncounter, this.defaulttopic);
    this.defaulttopic = top.name;
    this.showcounter = questioncounter;
    this.questioncounter = questioncounter;

    this.storage.store('questioncounter',questioncounter);
    this.storage.store('defaulttopic', top.name);
    this.loadquestions();
    this.checkPreviousAndBackButtonsDisabality();
    this.examService.triggerSubjectChange();
  }


  loadquestions() {

    let newquestions = this.storage.retrieve('newquestions');
    console.log(newquestions,'newquestions');
    if (newquestions == null) {
      this.getquestions();
    } else {
      let shownewquestions = true;
      newquestions.forEach((element: any) => {
        if (element.subjectname == this.defaulttopic) {
          this.selectedQuestions = element;
          shownewquestions = false;
          this.loadcurrentquestions(element);

        }

      });

      if (shownewquestions) {
        this.getquestions();
      }

    }

  }

  submitForm(form: any) {

    const searchparams: any = {
      searchParam: 'Y',
      userId: this.userObj.id,
      subject: this.stateForm.value.subject,
      pretype: this.stateForm.value.pretype,
      testtype: this.stateForm.value.testtype,
      status: 'APPROVED',
      rolecode: this.storage.retrieve('ROLE')
    }

    this.examService.postNode('getquestionsbysearch', searchparams).subscribe(
      async (resdata: any) => {
        this.svData = resdata;
        this.changequestions = resdata;

      },
      async () => { },
    )


  }

  changequestion(content: any) {
    console.log(this.question);

    const searchparams: any = {
      searchParam: 'Y',
      userId: this.userObj.id,
      subject: this.stateForm.value.subject,
      pretype: this.stateForm.value.pretype,
      testtype: this.stateForm.value.testtype,
      status: 'APPROVED',
      rolecode: this.storage.retrieve('ROLE')
    }

    this.examService.postNode('getquestionsbysearch', searchparams).subscribe(
      async (resdata: any) => {
        this.svData = resdata;
        this.changequestions = resdata;
        this.modalService.open(content, { size: 'xl' }).result.then(
          result => {
            //this.closeResult = `Closed with: ${result}`
          },
          reason => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
          },
        )
      },
      async () => { },
    )

  }

  loadcurrentquestions(element: any) {
    //console.log(element.questions,this.showcounter,this.questioncounter,'element');
    this.allquestions = element.questions;
    this.question = element.questions[this.showcounter];
    // this.question = element.questions[this.questioncounter];
    // document.getElementById("append").innerHTML = this.question.questiontext;
    this.questionchoices = this.question.questionchoices;
    console.log(this.questionchoices);
    if (this.questionchoices == undefined) {
      this.questionchoices = [];
    }
    this.numericvalue = this.question.numericanswer;

  }

  getquestions() {

    let questiondata = this.storage.retrieve('questiondata');
    //console.log(questiondata);

    // let questionnames =examdata.names.split('|');
    // console.log(questionnames[0]);
    this.examschedule_id = questiondata.examschedule_id;
    this.subjectid = questiondata.subject;
    questiondata.subjects.forEach((element: any) => {
      if (element.subjectname == this.defaulttopic) {

        // console.log(examdata.subjects[questionnames[0]]);

        this.selectedQuestions = element;
        this.question = element.questions[this.questioncounter];
        this.questionchoices = this.question.questionchoices;
        this.allquestions = element.questions;
        //numeric value?
      }
        const newquestiondata: any = {
          subjectname: element.subjectname,
          questions: element.questions,
          subjectId: element.subject
        }
        this.newselectionarray.push(newquestiondata);

        this.storage.store('newquestions', this.newselectionarray);

    });


    let examcountdown = this.storage.retrieve('examcountdown');
    if (examcountdown == null) {
      this.examcountdown = this.exam.duration;
    } else {
      this.examcountdown = examcountdown;
    }
    


  }


  submitexam() {

    let questionTimeCount=this.storage.retrieve('questionTimeCount');
    if (questionTimeCount) {
      this.updateTimeTakenQuestionWise(this.questioncounter, this.defaulttopic, questionTimeCount);
      this.storage.clear('questionTimeCount');
    }
    this.closeinterval();


    /* marks per correct anser */
    let mark_per_correct_answer = 4;
    /* marks will deduct for per wrong answer */
    let mark_per_wrong_answer = 1;

    /*note above two values (4 and 1) should be dynamic later from backend */

    this.issubmission = true;
    let newquestions = this.storage.retrieve('newquestions');
    let rules = this.storage.retrieve('rules');
    let examcountdown = this.storage.retrieve('examcountdown');
    let examreview = this.storage.retrieve('examreview');
    let examinfo = this.examService.getPresentExamInfo();

    let correct_answer = 0;
    let wrong_answer = 0;
    newquestions.forEach((subject: any) => {
      subject.questions.forEach((question: any) => {
        if (question.iscorrectanswer === 'Y') {
          correct_answer++;
        }
        if (question.iscorrectanswer === 'N') {
          wrong_answer++;
        }
      })
    });

    let total_time_spend = parseInt(rules.duration) - parseInt(examcountdown);

    let score = (correct_answer * mark_per_correct_answer) - (mark_per_wrong_answer*wrong_answer);

    /* clearing exam time from localStorage */
    this.storage.clear('examcountdown');
    /* storing total time spend to local storage */
    this.storage.store('totaltimespend',total_time_spend);

    const savedata: any = {
      examid: examinfo.examid.sequence,
      scheduleid: examinfo.scheduleid,
      studentid: localStorage.getItem('studentid'),
      "ruleid": rules._id,
      "testtype": rules.testtype,
      "score": score,
      "totaltimespend": total_time_spend,
      "questionanswer": newquestions,
      "examtype": rules.examtype,
      "coursetype": rules.coursetype,
      "status": "COMPLETED",
      "testreview": examreview,
      "examsubmittedon": new Date()
    }

    let _headers = {
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'methodtype': 'SUBMITRESULT',
      'Content-Type': 'application/json'
    };

    this.examService.submitExam(savedata, _headers).subscribe(result => {

      // console.log('exam saved', result);

    this.router.navigateByUrl('/dashboard/viewtestreport');
    });

  }

  getnumericQuestions(value: any) {
    //console.log(value);
    let counter = 0;
    let studentanswerarray: any[] = [];

    this.allquestions.forEach((element: any) => {
      if (counter == this.questioncounter) {
        let qeschoices = [];
        qeschoices = this.question.questionchoices;
        let newchoice: any = [];
        if (element.questionanswer == value) {
          element.iscorrectanswer = 'Y';
        } else {
          element.iscorrectanswer = 'N';
        }

        element.numericanswer = value
        studentanswerarray.push(element);
      } else {

        studentanswerarray.push(element);
      }

      counter++;
    });
    const newquestiondata: any = {
      subjectId: this.allquestions[0].subject,
      subjectname: this.allquestions[0].subjectname,
      questions: studentanswerarray
    }
    console.log(newquestiondata);
    if (this.newselectionarray.length == 0) {
      this.newselectionarray.push(newquestiondata);
    } else {
      let selectionarray: any[] = [];
      this.newselectionarray.forEach((element: any) => {
        if (element.subjectname == this.allquestions[0].subjectname) {
          selectionarray.push(newquestiondata);
        } else {
          selectionarray.push(element);
        }
        this.newselectionarray = selectionarray;
      });
    }
    //this.question = studentanswerarray;
    console.log(this.newselectionarray);

    this.storage.store('newquestions', this.newselectionarray);
    this.loadquestions();

  }

  getquestionIndex(index: any, event: any) {
    
    let enteredanswer: any = [];
    let studentanswerarray: any = [];
    let newanswers: any = [];
    let answerselected = false;
    //this.storage.remove('questions');
    if (event.target.checked == true) {
      answerselected = true;
      enteredanswer.push(index);
    } else {
      enteredanswer.forEach((element: any) => {

        if (index != element) {
          newanswers.push(element);
        }
      });
      enteredanswer = newanswers;
    }
    let counter = 0;

    this.allquestions.forEach((element: any) => {
      if (counter == this.questioncounter) {
        let qeschoices = [];
        qeschoices = this.question.questionchoices;
        let newchoice: any = [];

        qeschoices.forEach((choiceelement: any) => {
          if (index == parseInt(choiceelement.choiceid) && answerselected) {
            choiceelement.isselected = true;
            choiceelement.correctanswer = element.questionanswer

          } else {
            choiceelement.isselected = false;
          }
          // console.log(index);
          if (index == element.questionanswer) {
            element.iscorrectanswer = 'Y';
          } else {
            element.iscorrectanswer = 'N';
          }
          element['ismarkedforreview'] = false;
          newchoice.push(choiceelement);
          element.questionchoices = newchoice;
          element.selectedanswer = enteredanswer;

        });

        element['answer_given'] = answerselected;
        studentanswerarray.push(element);
      } else {

        studentanswerarray.push(element);
      }

      counter++;
    });
    const newquestiondata: any = {
      subjectId: this.allquestions[0].subject,
      subjectname: this.allquestions[0].subjectname,
      questions: studentanswerarray
    }
    //console.log(newquestiondata);
    if (this.newselectionarray.length == 0) {
      this.newselectionarray.push(newquestiondata);
    } else {
      let selectionarray: any = [];
      this.newselectionarray.forEach((element: any) => {
        if (element.subjectname == this.allquestions[0].subjectname) {
          selectionarray.push(newquestiondata);
        } else {
          selectionarray.push(element);
        }
        this.newselectionarray = selectionarray;
      });
    }


    this.storage.store('newquestions', this.newselectionarray);
    this.loadquestions();

  }

  async swipeNext() {
  
    if (this.questioncounter+1 == this.selectedQuestions.questions.length) {
      //this.noquestions = false;
      
      let currentSubjectIndex=this.topics.map((topic:any)=>{ return topic.name; }).indexOf(this.defaulttopic);
      if (currentSubjectIndex<this.topics.length-1) {
        this.changetopics(this.topics[currentSubjectIndex+1]);
      } else {
        return;
      }
      //console.log(this.questioncounter, this.selectedQuestions.questions.length, currentSubjectIndex);
    
    } else {
      this.updateTimeTakenQuestionWise(this.questioncounter, this.defaulttopic);
      this.markAsVisited('swipenext');
      this.questioncounter = this.questioncounter + 1;
      this.showcounter = this.showcounter + 1;
      this.loadquestions();
      this.storage.store('questioncounter',this.questioncounter);
    }

    this.checkPreviousAndBackButtonsDisabality();
    
  }
  swipePrevious() {
   
    if (this.questioncounter == 0) {

      let currentSubjectIndex=this.topics.map((topic:any)=>{ return topic.name; }).indexOf(this.defaulttopic);
      if (currentSubjectIndex > 0) {

        let newquestions = this.storage.retrieve('newquestions');
        let questionsOfCurrentSubject = newquestions.filter((question: any) => {
          return question.subjectname == this.topics[currentSubjectIndex - 1].name;
        });
        this.changetopics(this.topics[currentSubjectIndex - 1], questionsOfCurrentSubject[0].questions.length-1);
        
      } else {
        return;
      }
      
    } else {
          this.updateTimeTakenQuestionWise(this.questioncounter, this.defaulttopic);
          this.markAsVisited('swipeprevious');
          this.questioncounter = this.questioncounter - 1;
          this.showcounter = this.showcounter - 1;
          this.loadquestions();
          this.storage.store('questioncounter',this.questioncounter);
    }

    this.checkPreviousAndBackButtonsDisabality();
  }


  markAsVisited(from_: any) {
    
    let addIndex = 0;
    if (from_ === 'swipenext') {
      addIndex = 1;
    }
    let newquestions = this.storage.retrieve('newquestions');
    //console.log(this.defaulttopic,'defaulttopic');
    newquestions.forEach((nq: any) => {
      if (this.defaulttopic === nq.subjectname) {
        nq.questions[this.questioncounter + addIndex]['isvisited'] = true;
      }
    })
    this.storage.store('newquestions', newquestions);
    this.closeinterval();
    this.startQuestionCount();
  }

  markForReviewAndNext(): any {
    let newquestions = this.storage.retrieve('newquestions');
    newquestions.forEach((nq: any) => {
      if (this.question.subject == nq.subjectId) {
        nq.questions[this.questioncounter]['ismarkedforreview'] = true;
      }
    })
    this.storage.store('newquestions', newquestions);
    this.swipeNext();
  }

  startQuestionCount(): any {
    this.questionTimeCount = 0;
    this.questionIntervalCount = setInterval(() => {
      this.questionTimeCount++;
      this.storage.store('questionTimeCount',this.questionTimeCount);
    }, 1000);
  }

  closeinterval(): any {
    clearInterval(this.questionIntervalCount)
  }

  clearResponse(){

    let enteredanswer: any = [];
    let studentanswerarray: any = [];
    let newanswers: any = [];
    let answerselected = false;
    //this.storage.remove('questions');

    let counter = 0;
    this.allquestions.forEach((element: any) => {
      if (counter == this.questioncounter) {
        let qeschoices = [];
        qeschoices = this.question.questionchoices;
        let newchoice: any = [];

        qeschoices.forEach((choiceelement: any) => {
          choiceelement.isselected = false;
          newchoice.push(choiceelement);
        });
        element['ismarkedforreview'] = false;
        element['isvisited'] = true;
        element['answer_given'] = false;
        element.questionchoices = newchoice;
        element.selectedanswer = enteredanswer;
        studentanswerarray.push(element);
      } else {
        studentanswerarray.push(element);
      }
      counter++;
    });


    const newquestiondata: any = {
      subjectId: this.allquestions[0].subject,
      subjectname: this.allquestions[0].subjectname,
      questions: studentanswerarray
    }
    //console.log(newquestiondata,'newquestiondata');
    if (this.newselectionarray.length == 0) {
      this.newselectionarray.push(newquestiondata);
    } else {
      let selectionarray: any = [];
      this.newselectionarray.forEach((element: any) => {
        if (element.subjectname == this.allquestions[0].subjectname) {
          selectionarray.push(newquestiondata);
        } else {
          selectionarray.push(element);
        }
        this.newselectionarray = selectionarray;
      });
    }
    //this.question = studentanswerarray;
    //console.log(this.newselectionarray);

    this.storage.store('newquestions', this.newselectionarray);
    this.loadquestions();

  }

  checkPreviousAndBackButtonsDisabality() {
    
    if (this.topics[0].name==this.defaulttopic) {
      if (this.questioncounter==0) {
        this.previousButtonDisable = true;
      } else {
        this.previousButtonDisable = false;
      }
    } else {
      this.previousButtonDisable = false;
    }

    let last_topic = this.topics[this.topics.length - 1];

    let newquestions = this.storage.retrieve('newquestions');
    let questionsOfLastSubject = newquestions.filter((question: any) => {
      return question.subjectname == last_topic.name;
    });

    let lastSubjectTotalQuestions = questionsOfLastSubject[0].questions.length;

    if (last_topic.name==this.defaulttopic && ((lastSubjectTotalQuestions-1)== this.questioncounter)) {
      this.nextButtonDisable = true;
    } else {
      this.nextButtonDisable = false;
    }
  }

  updateTimeTakenQuestionWise(questionCounter:any,subjectName:any,questionTimeCount:any=0) {
    let newquestions = this.storage.retrieve('newquestions');
    newquestions.forEach((nq: any) => {
      if (subjectName === nq.subjectname) {
        if (nq.questions[questionCounter]['visitedtime']) {
          if (questionTimeCount) {
            nq.questions[questionCounter]['visitedtime'] = nq.questions[questionCounter]['visitedtime'] + questionTimeCount;
          } else {
            nq.questions[questionCounter]['visitedtime'] = nq.questions[questionCounter]['visitedtime'] + this.questionTimeCount;
          }
          
        } else {
          if (questionTimeCount) {
            nq.questions[questionCounter]['visitedtime'] = questionTimeCount;
          } else {
            nq.questions[questionCounter]['visitedtime'] = this.questionTimeCount;
          }
          
        }
      }
    })
    this.storage.store('newquestions', newquestions);
  }

  updateDisplayCounterIndex(subjectName:any) {
    let topicIndex = this.topics.map((topic: any) => topic.name).indexOf(subjectName);
    let topicsQuestionsToCount:any = [];
    this.topics.forEach((topic:any,index:any) => {
      if (index<topicIndex) {
        topicsQuestionsToCount.push(topic.name)
      }
    });

    if (topicsQuestionsToCount.length) {
      let previousQuestionsTotal = 0;
      let newquestions = this.storage.retrieve('newquestions');
      if (newquestions && newquestions.length) {
        newquestions.forEach((subject: any) => {
          if (topicsQuestionsToCount.includes(subject.subjectname)) {
            previousQuestionsTotal = previousQuestionsTotal + subject.questions.length;
          }
        });
      }
      this.addNumberToCounterForDisplayNumber = previousQuestionsTotal;
    } else {
      this.addNumberToCounterForDisplayNumber = 0;
    }
  }

}
