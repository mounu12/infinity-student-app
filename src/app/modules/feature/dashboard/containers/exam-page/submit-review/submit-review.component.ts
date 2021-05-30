import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-submit-review',
  templateUrl: './submit-review.component.html',
  styleUrls: ['./submit-review.component.css']
})
export class SubmitReviewComponent implements OnInit {

  reviewForm: any = {
    difficultyLevel: 'EASY',
    difficultylevelOptions: {
      'Buffering': false,
      'Internet Issue': false,
      'Test did not load': false,
      'Images did not load': false,
      'Images were not clear': false,
      'Other': false
    },
    feedback: ''
  };

  review: any = {
    "testtype": "",
    "difficultylevel": [],
    "feedback": ""
  } 
  constructor(private dialogRef: MatDialogRef<SubmitReviewComponent>, private storage: LocalStorageService) { }

  ngOnInit(): void {
  }

  setDifficulty(difficultyLevel: any){
    this.review.testtype = difficultyLevel;
    this.reviewForm.difficultyLevel = difficultyLevel;
  }

  submitReview(){
    let diflops = Object.keys(this.reviewForm.difficultylevelOptions)
    diflops.forEach((diflop: any) => {
      if(this.reviewForm.difficultylevelOptions[diflop] === true) {
        this.review.difficultylevel.push(diflop)
      }
    });
    this.review.feedback = this.reviewForm.feedback;

    this.storage.store('examreview', this.review);
    this.dialogRef.close('submitted');
  }

}
