import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'student-learning-console';
  token : any;
  constructor(
  public router: Router,
  ) {}
  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd ) {
        
      }
    });
  }


  
}
