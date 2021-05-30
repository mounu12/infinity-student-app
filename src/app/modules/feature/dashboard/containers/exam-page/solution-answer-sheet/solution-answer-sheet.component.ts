import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExamService } from '../../../../../../services/test/exam.service';

@Component({
  selector: 'app-solution-answer-sheet',
  templateUrl: './solution-answer-sheet.component.html',
  styleUrls: ['./solution-answer-sheet.component.css']
})
export class SolutionAnswerSheetComponent implements OnInit {

  @Input() selectedQuestions: any;
  @Input() startfrom: any;
  @ViewChild('questionPointerHolderSolution') questionPointerHolderSolution:any;
  showdiv =true;
  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.examService.subjectChangeSolutionPage.subscribe((data:any) => {
      //console.log(this.questionPointerHolder);
      this.questionPointerHolderSolution.nativeElement.scrollTop = 0;
    })
  }

  showSelectedQuestion(questionNumber: any): any {
    this.examService.showSelectedQuestionInReport(questionNumber);
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
