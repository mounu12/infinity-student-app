import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-submit-confirmation',
  templateUrl: './submit-confirmation.component.html',
  styleUrls: ['./submit-confirmation.component.css']
})
export class SubmitConfirmationComponent implements OnInit {
  countdown: any;
  markedforreviewcount: any=0;
  unasweredquestionscount: any = 0;

  answeredCount: any = 0;
  notAnsweredCount: any = 0;
  notVisitedCount: any = 0;
  notAnsweredMarkReviewCount: any = 0;
  answeredMarkReviewCount: any = 0;

  constructor(private dialogRef: MatDialogRef<SubmitConfirmationComponent>, private storage: LocalStorageService) { }

  ngOnInit(): void {

    this.countdown = this.storage.retrieve('examcountdown');

    let subjectwisequestions = this.storage.retrieve('newquestions');
    subjectwisequestions && subjectwisequestions.forEach((subs: any) => {
      subs.questions && subs.questions.forEach((ques: any) => {
        if(ques.ismarkedforreview && ques.answer_given) {
          this.answeredMarkReviewCount++;
        } 
        if(ques.ismarkedforreview && !ques.answer_given){
          this.notAnsweredMarkReviewCount++;
        }
        if(ques.answer_given && !ques.ismarkedforreview) {
          this.answeredCount++;
        }

        if(ques.isvisited && !ques.answer_given && !ques.ismarkedforreview) {
          this.notAnsweredCount++;
        }
        if (!ques.isvisited && !ques.answer_given) {
          this.notVisitedCount++
        }
        
      })
    })

    let counter=this.storage.retrieve('examcountdown');
    var time_in_seconds = parseFloat(counter) * 60;
    this.countdown=new Date(time_in_seconds * 1000).toISOString().substr(11, 8)
    //this.countdown = parseInt('' + 1*this.countdown/ 60) + ':' + (1*this.countdown % 60);

  }

  backToTest(){
    this.dialogRef.close(null);
  }

  finishTest(){
    this.dialogRef.close('finish');
  }

}
