import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.css']
})
export class MyReportsComponent implements OnInit {

  reportAvailable= false;
  @Input() infoBoxes: any;
  
  report: any = {
    'totaltests': 0,
    'completedtests':0,
    'totaltimespent':0,
    'heighestscore':0
  };
  constructor() { }

  ngOnInit(): void {
   
  }

  setInfoBoxes(infoBoxes: any){
    console.log('infoboxes', infoBoxes);
    
    infoBoxes.forEach((inb: any) => {
      if(inb.paper?.completed){
        this.reportAvailable = true;
      }
    })
    
    if(infoBoxes){
      console.log('infoBoxessss', this.infoBoxes)
      infoBoxes.forEach((infb:any) => {
        console.log('infb.paper', infb.paper)
        this.report['totaltests'] += infb.paper.total;
        this.report['completedtests'] += infb.paper.completed;
        this.report['totaltimespent'] += infb.paper.totalTimeSpent;
        this.report['heighestscore'] += infb.paper.highestScore;
      });
      this.report.totaltimespent = this.timeConvert(this.report.totaltimespent);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  timeConvert(n:number) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return  rhours + " h " + rminutes + " m";
  }
}
