import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.css']
})
export class ExamPageComponent implements OnInit {

  constructor(private location: LocationStrategy) {
    //history.pushState(null, null, window.location.href);  
    // this.location.onPopState(() => {
    //   window.history.pushState(null, '', '/#/dashboard/exampage');
    // });  
  }

  ngOnInit(): void {
  }

}
