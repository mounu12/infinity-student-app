import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ExamService } from '../../../../../../services/test/exam.service';

@Component({
  selector: 'app-answer-sheet',
  templateUrl: './answer-sheet.component.html',
  styleUrls: ['./answer-sheet.component.css']
})
export class AnswerSheetComponent implements OnInit {

  @Input() selectedQuestions: any;
  @Input() addNumberToCounterForDisplayNumber: any;
  @ViewChild('questionPointerHolder') questionPointerHolder:any;

  showdiv =true;
  constructor(private examService: ExamService) { }

  ngOnInit(): void {

    this.examService.subjectChange.subscribe((data:any) => {
      //console.log(this.questionPointerHolder);
      this.questionPointerHolder.nativeElement.scrollTop = 0;
    })
  }
  
  showSelectedQuestion(questionNumber: any): any {
    this.examService.showSelectedQuestion(questionNumber);
  }
  showhidediv(){
     if(this.showdiv ==true){
       this.showdiv =false;
     }else{
       this.showdiv= true;
     }
  }

  showhidedivHide(){ 
     if(this.showdiv ==false){
       this.showdiv =true;
     }else{
       this.showdiv= false;
     }
  }

  
}
