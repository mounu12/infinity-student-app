import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { NavigationEnd, Router } from '@angular/router';
import { ExamService } from '../../../../../../services/test/exam.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UserService } from '@app-services/user/user.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  private history: string[] = []
  aggree: boolean = false;
  detail: any;
  is_exam_started: boolean = false;
  constructor(private router: Router, private location: Location, private examservice: ExamService,
    private storage: LocalStorageService,
    private examService: ExamService, private userService: UserService) {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.history.push(event.urlAfterRedirects)
    //   }
    // })
    this.detail = this.userService.getMobileAndName()
   
   }

  ngOnInit(): void {
    let exam_meta_data: any = localStorage.getItem('exam_meta_data');
    if (exam_meta_data) {
      this.examService.updatedExamMetaDataSource(JSON.parse(exam_meta_data));
    }

    this.examService.examMetaData.subscribe((data) => {
      if (data  && data.submitted==false && data.started && data.started==true) {
        this.is_exam_started = true;
      }
    });
  }

  back(): void {
    this.location.back()
    // this.history.pop()
    // if (this.history.length > 0) {
    //   this.location.back()
    // } else {
    //   this.router.navigateByUrl('/')
    // }
  }

  beginWalkthrough() {
    this.router.navigateByUrl('/dashboard/beginwalkthrough');
  }

  beginTest() {
    
    // this.router.navigateByUrl('/dashboard/exampage');
    let examInfo = this.examservice.getPresentExamInfo();
    this.examService.getExamId().subscribe((examid) => {
      examInfo['examid'] = examid;
      examInfo['issubmitted'] = false;
      examInfo['isexamstrated'] = true;
      this.examService.setPresentExamInfo(examInfo)
      this.reviewquestions(examInfo);

      let examMetaData = { 'examid': examid.sequence, 'submitted': false, 'started': true };
      this.examService.updatedExamMetaDataSource(examMetaData);
      localStorage.setItem('exam_meta_data', JSON.stringify(examMetaData));
      
      if (this.storage.retrieve('questioncounter')) {
        this.storage.clear('questioncounter');
      }
      if (this.storage.retrieve('defaulttopic')) {
        this.storage.clear('defaulttopic');
      }
      this.examService.triggerTestBegins();
    });

    
  }


  reviewquestions(data: any){
    const postdata = {
      scheduleid: data.scheduleid,
      ruleid: data._id,
      createdby: `${this.detail?.mobile}`,
    }
    this.storage.clear('examdata');
    this.storage.clear('questiondata');
    this.storage.clear('newquestions');
    this.storage.clear('questioncounter');
    this.examService.postNode('examschedule', postdata).subscribe(
      async resdata => {
        if (resdata.schedule) {
          this.storage.store('examdata', resdata.schedule);
          this.examService.postNode('examquestions', postdata).subscribe(
            async resdata1 => {
              if (resdata1.questions) {
                console.log('resdata1.questions', resdata1.questions);
                this.storage.store('rules', data);

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
                this.storage.store('questiondata', resdata1.questions);
                this.router.navigate(['/dashboard/exampage']);
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

  setSubjectName(questions: any, subname: string): any {
    questions && questions.length> 0 && questions.forEach((ques: any) => {
      ques.subjectname = subname;
    })

    return questions;
  }

}
