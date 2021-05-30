import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-begin-walkthrough',
  templateUrl: './begin-walkthrough.component.html',
  styleUrls: ['./begin-walkthrough.component.css']
})
export class BeginWalkthroughComponent implements OnInit {
  pageNumber: any;

  constructor(private router: Router) {
    this.pageNumber = 1;
   }

  ngOnInit(): void {
  }

  showpage(pageNumber: any){
    if(pageNumber === 0){
      this.router.navigateByUrl('/dashboard/testinstructions')
    }

    this.pageNumber = pageNumber;
  }

}
