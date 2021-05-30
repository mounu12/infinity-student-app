import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { AlertController, IonSlides, NavController } from '@ionic/angular';
//import { ExamService } from 'src/services/exam.service';
//import { Storage } from '@ionic/storage';
//import { ToastService } from 'src/services/toastr.service';
//import { LoaderService } from 'src/services/LoaderService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { ExamService } from '../../../../../../services/test/exam.service';
import { UserService } from '@app-services/user/user.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
// import * as Editor from 'src/app/pages/customers/ckeditor/ckeditor';
declare var swal: any;
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.css'],
})
export class SolutionComponent implements OnInit {
  question: any;
  questioncounter = 0;
  btnvar = "btn";
  classvar = "d-flex previous_btn";
  content: any;
  topics: any = [];
  topicsByName:  any;
  exam: any = {
    duration: 0,
    totalquestions: 0
  };
  timer: any;
  questionchoices: any = [];
  questionselected = 0;
  allquestions: any = [];
  defaulttopicIndex: any = 0;
  examcountdown: any = 0;
  studentId: any = '';
  examschedule_id: any = 0;
  subjectid: any = 0;
  deftotal: any = 0;
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
  stateForm: FormGroup;
  selectedQuestions: any;
  questionIntervalCount: any;
  questionTimeCount: number = 0;
  detail: any;
  token: any;
  testname = null;
  questiondata: any;
  questiondataBySubName: any = {};
  examsubmittedon: any;
  defaultTopicSet: any = false;

  @ViewChild('questionHolder') questionHolder:any;
  constructor(
    private storage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private examService: ExamService,
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
    
    let examdata = this.storage.retrieve('examdata');
    this.exam = examdata;

    let subDate;
    if(examdata.examsubmittedon) {
      subDate = new Date(examdata.examsubmittedon);
    } else {
      subDate = new Date(); //remove this to retrieve the actual date for a test attempted in current session
    }

    this.examsubmittedon = `${subDate.getDate()} ${monthNames[subDate.getMonth()]} ${subDate.getFullYear()}`;
    this.topics = [
      { name: "PHYSICS", total: "45", startfrom: 45, position: 0, positionback: 89},
      { name: "CHEMISTRY", total: "45", startfrom: 0, position: 1, positionback: 44 },
    { name: "BIOLOGY", total: "90", startfrom: 90, position: 2, positionback: 179 }]
    this.topicsByName = {
      [this.topics[0].name]: this.topics[0],
      [this.topics[1].name]: this.topics[1],
      [this.topics[2].name]: this.topics[2],
    }
    this.questiondata = this.storage.retrieve('questiondata');
    
    this.questiondata.subjects.forEach((q:any) => {
      this.questiondataBySubName[q.subjectname] = q;
    })
    let count = 0;
    this.topics.forEach((topic: any) => {
      
      let subjectData = this.questiondataBySubName[topic.name];
      if(subjectData) {
        topic.total = subjectData.questions.length;
        topic.startfrom = count + 1
        count += subjectData.questions.length
        topic.positionback = count - 1;
      }  
    });

    
    this.stateForm = this.fb.group({

      subject: [null],
      chapter: [null],
      testtype: [null],
      pretype: [null],


    });

    this.examService.showReportQuestionByNumber.subscribe((questionNumber: any) => {
      //console.log('show selected Question')
      this.showcounter = questionNumber - 1;
      this.questioncounter = questionNumber - 1;
      this.swipeNext();
    });
    
    this.route.queryParams.subscribe(params => {

      if(this.topicsByName[params['subject']]) {
        this.defaulttopicIndex = this.topicsByName[params['subject']].position
        this.defaultTopicSet = true;
      };

    });
  }
  ngOnInit() {
    
    document.body.style.setProperty('--my-var', 'option rigt_answers');
    if(!this.defaultTopicSet) {
      if (this.storage.retrieve('questioncounter') != null) {
        this.questioncounter = this.storage.retrieve('questioncounter');
      }
      if (this.storage.retrieve('defaulttopicIndex') != null) {
        this.defaulttopicIndex = this.storage.retrieve('defaulttopicIndex');
      }
    }
    this.deftotal = this.topics[this.defaulttopicIndex].total;
    this.showcounter = 0;


    this.loadquestions();
    this.testname = this.storage.retrieve('testname');
    
    this.newselectionarray = this.storage.retrieve('newquestions') || [];
    
  }

  changetopics(topIndex: any, isPrevTopic: any) {
    let topic = this.topics[topIndex]
    this.defaulttopicIndex = topIndex;
    this.deftotal = topic.total;
    this.questioncounter = isPrevTopic ? topic.total - 1: 0;
    this.storage.store('questioncounter', this.questioncounter);
    this.storage.store('defaulttopicIndex', topIndex);
    this.loadquestions();
    this.examService.triggerSubjectChangeSolutionPage();
  }

  loadquestions() {

    let newquestions = this.storage.retrieve('newquestions');
    //console.log(newquestions);
    if (newquestions == null) {
      this.getquestions();
    } else {
      let shownewquestions = true;
      newquestions.forEach((element: any) => {

        let topic = this.topicsByName[element.subjectname];
        if(topic && topic.name == this.topics[this.defaulttopicIndex].name) {
          this.selectedQuestions = element;
          shownewquestions = false;
          this.loadcurrentquestions(element);
        }
      });

      if (shownewquestions) {
        this.getquestions();
      }

    }
    if (this.questionHolder) {
      this.questionHolder.nativeElement.scrollTop = 0;
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
    //console.log(this.question);

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

  dataChanged(event: any) {
    //console.log(event);
    let filterarray = this.svData.filter(element => element.questiontext.indexOf(event) != -1);
    //console.log(filterarray);
    this.changequestions = filterarray;
    if (event == '') {
      this.changequestions = this.svData;
    }
  }

  loadcurrentquestions(element: any) {
    this.allquestions = element.questions;
    this.question = element.questions[this.questioncounter];
    // this.question = element.questions[this.questioncounter];
    // document.getElementById("append").innerHTML = this.question.questiontext;
    this.questionchoices = this.question.questionchoices;
    //console.log(this.questionchoices);
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
      if (element.subjectname == this.topics[this.defaulttopicIndex].name) {

        // console.log(examdata.subjects[questionnames[0]]);

        this.selectedQuestions = element;
        this.loadcurrentquestions(element);
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

  async confirmforautosubmit() {
    if (!this.issubmission) {
      /* const alert = await this.alertController.create({
         cssClass: 'syllabus',
         header: 'Auto Submit Alert !!',
         message: 'Your time has expired ,Your exam will be auto submitted',
         buttons: [
           {
             text: 'Ok',
             handler: () => {
               console.log('Confirm Okay');
               this.submitexam();
 
             }
           }
         ]
       });*/
    }

  }

  startcountdown() {
    //var a = parseInt(this.currentduration);
    var a = 0;
    var b = parseInt(this.examcountdown);
    let interval = setInterval(() => {
      //console.log(a++);
      //  console.log(this.currentduration);
      if (a == b) {
        clearInterval(interval);
        this.confirmforautosubmit();
      }
      this.examcountdown = parseInt(this.examcountdown) - 1;
      this.storage.store('examcountdown', this.examcountdown);



    }, 60000);


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
    //console.log(newquestiondata);
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
    //console.log(this.newselectionarray);

    this.storage.store('newquestions', this.newselectionarray);
    this.loadquestions();


  }

  getquestionIndex(index: any, event: any) {
    //console.log(event.target.checked);
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
    //this.question = studentanswerarray;
    //console.log(this.newselectionarray);

    this.storage.store('newquestions', this.newselectionarray);
    this.loadquestions();
  }

  async swipeNext() {
    let topic = this.topics[this.defaulttopicIndex]
    if (topic.total - 1 == this.questioncounter) {
      this.changetopics(topic.position + 1, false);
    } else {
      this.questioncounter++;
      this.loadquestions();
    }
    this.storage.store('questioncounter',this.questioncounter);
  }

  swipePrevious() {
    let topic = this.topics[this.defaulttopicIndex]
    if (this.questioncounter == 0) {
      if(this.defaulttopicIndex != 0) {
        this.changetopics(topic.position - 1, true);
      }
    } else {
      this.questioncounter--;
      this.loadquestions();
    }
    this.storage.store('questioncounter',this.questioncounter);
  }

  markForReviewAndNext(): any {
    let newquestions = this.storage.retrieve('newquestions');
    newquestions.forEach((nq: any) => {
      nq.questions[this.questioncounter]['ismarkedforreview'] = true;
    })
    this.storage.store('newquestions', newquestions);
    this.swipeNext();
  }

  startQuestionCount(): any {
    this.questionTimeCount = 0;
    this.questionIntervalCount = setInterval(() => {
      this.questionTimeCount++;
    }, 1000);
  }

  closeinterval(): any {
    clearInterval(this.questionIntervalCount)
  }

  backtoviewreportpage() {
    this.router.navigate(['/dashboard/viewtestreport']);
  }

}
