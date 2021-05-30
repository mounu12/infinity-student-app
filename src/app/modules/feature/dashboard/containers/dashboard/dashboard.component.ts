import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app-core/components/auth-service/auth.service';
import { UserService } from '@app-services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { TestlistService } from '../../../../../services/test/testlist.service';
import { MyReportsComponent } from './my-reports/my-reports.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  overallTests =[];
  studentExamResult = [];
  @ViewChild(MyReportsComponent) myreportscomponent: MyReportsComponent= new MyReportsComponent();
  
  infoBoxes = [
    {
      logo: 'assets/img/peper-icon.svg',
      heading: 'NEET Previous Year Papers',
      paper: {
        total: 0,
        completed: 0,
        totalTimeSpent: 0,
        highestScore: 0
      },
      infotext: 'Practice the previous year papers from 2010 and be ready for your NEET exam',
      link: {
        label: 'OPEN LIST',
        route: '#/dashboard/testlist'
      }
    },
    {
      logo: 'assets/img/tests-icons.svg',
      heading: 'NEET Mock Tests',
      paper: {
        total: 0,
        completed: 0,
        totalTimeSpent: 0,
        highestScore: 0
      },
      infotext: 'We\’ve curated 50+ mock tests to help you reach your best potential for the exam',
      link: {
        label: 'OPEN LIST',
        route: '#/dashboard/testlist?examtype=MOCKTEST'
      }
    }
  ]
  token: any;
  detail: any;
  user: any;
  profilePhoto: any;
  userId: any;
  userData: any;
  constructor(private dashboardService: DashboardService, private testListService: TestlistService,
    private userService: UserService, private storage: LocalStorageService, public router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
     ) { 
    this.token = localStorage.getItem('token')
    this.detail = this.userService.getMobileAndName()
        console.log(this.detail)
        this.profilePhoto = this.detail?.profilePhoto
        this.authService.setIsExamStarted(false)
  }

  ngOnInit(): void {

    let mobile_and_name: any = localStorage.getItem('mobile_and_name');
    let mobile_and_name_obj = JSON.parse(mobile_and_name);
    if (!localStorage.getItem('studentid')) {
      localStorage.setItem('studentid', mobile_and_name_obj.mobile);
    }
    

    console.log(this.user)
    this.user = this.userService.getUser();
    this.userId = this.user.personalDetails.userId
    this.loadUser();
    this.storage.clear('examcountdown');

    this.spinner.show();
    let _headers = {
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'methodtype': 'RULES'
    };
    let infoBoxes = Object.assign(this.infoBoxes);
    this.testListService.getPreviousAndPresentMockTests(_headers).subscribe((overallTests: any) => {
      let neetTest = overallTests.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN' );
      infoBoxes[1].paper.total = neetTest.length;

      let neetOldTestLen = overallTests.length - neetTest.length;
      infoBoxes[0].paper.total = neetOldTestLen;   
      
      this.overallTests = overallTests;
    })

    let _headers_for_Exam = {
      'methodtype': 'GETTESTS',
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'Content-Type': 'application/json'
    };
    let _body_for_exam_result = {
      "studentid":localStorage.getItem('studentid'),
      "scheduleid":"null",
      "ruleid":"null"
    }
    this.testListService.getStudentExamResult(_body_for_exam_result, _headers_for_Exam).subscribe((allTestsbyStudent: any) => {
      
      let neetOldTest = allTestsbyStudent.filter((dr: any) => dr.examtype !== 'MOCKTEST' && dr.examtype !== 'JEEMAIN');
      infoBoxes[0].paper.completed = neetOldTest.length;
      neetOldTest.forEach((test: any) => {
        infoBoxes[0].paper.totalTimeSpent += Number(test.totaltimespend);
        infoBoxes[0].paper.highestScore <  Number(test.score) ? infoBoxes[0].paper.highestScore =  Number(test.score): '';
      });

      let neetTest = allTestsbyStudent.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN' );
      infoBoxes[1].paper.completed = neetTest.length;
      neetTest.forEach((test: any) => {
        infoBoxes[1].paper.totalTimeSpent += Number(test.totaltimespend);
        infoBoxes[1].paper.highestScore <  Number(test.score) ? infoBoxes[0].paper.highestScore =  Number(test.score): '';
      });
      this.studentExamResult = allTestsbyStudent;
      this.infoBoxes = infoBoxes;
      this.myreportscomponent.setInfoBoxes(this.infoBoxes);
      this.spinner.hide();
    })
  }

  loadUser(): void {
    this.userService.loadUserDetails(this.userId).subscribe((data) => {
      this.userData = data;
      this.profilePhoto = data.profilePhoto
    });
  }

  showMyProfile() : void {
    this.router.navigate(['myprofile']);
  }

  showDashboard (): void {
    this.router.navigate(['dashboard']);
  }

  // CloseDaysLeftBox () : void {
  //   this.displayDaysLeft = false
  // }

  logout() : void {
    localStorage.clear();
    this.authService.updateAuthStatus(false);
    this.router.navigate(['']);
  }

  setDefaultPic() {
    this.profilePhoto = "../../../../../../assets/img/empty-profile.svg";
  }

}
