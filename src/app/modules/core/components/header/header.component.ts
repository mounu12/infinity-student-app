import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { SubmitReviewComponent } from '@app-modules/feature/dashboard/containers/exam-page/submit-review/submit-review.component';
import { UserService } from '@app-services/user/user.service';
import { LocalStorageService } from 'ngx-webstorage';
import { LogindialogComponent } from 'src/app/modules/shared/components/logindialog/logindialog.component';
import { ExamService } from '../../../../services/test/exam.service';
import { QuestionComponent } from '../../../feature/dashboard/containers/exam-page/question/question.component';
import { SubmitConfirmationComponent } from '../../../feature/dashboard/containers/exam-page/submit-confirmation/submit-confirmation.component';
import { AuthService } from '../auth-service/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  examInfo: any = {};
  timer_ticker: string = '';
  timeInterval: any;
  counter: any = 1;
  token: any;
  isAuthenticated: any;
  profilePhoto: any;
  userId: any;
  user:any;
  is_exam_started: boolean = false;
  current_route_url = '';
  timer_header_for_routes = ['/dashboard/exampage','/dashboard/testinstructions'];
  timerWarning:boolean = false;
  constructor(
    private dialog: MatDialog,
    private examService: ExamService,
    private storage: LocalStorageService,
    public router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.token = localStorage.getItem('token')
    // console.log(this.token)
    this.authService.isAuth.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      // console.log(this.isAuthenticated)
      if(this.isAuthenticated){
        const user = this.userService.getUser();
        // console.log(user)
        this.userId = user?.personalDetails?.userId
        this.loadUser();
      }
    });

    this.profilePhoto = this.authService.photo.subscribe(pic => this.profilePhoto = pic);
    
    let examinfofromstore = this.storage.retrieve('examinfo');
    if(examinfofromstore){
      this.examInfo = examinfofromstore;
      let examcountdown = this.storage.retrieve('examcountdown');
      let exam_meta_data: any = localStorage.getItem('exam_meta_data');
      if (examcountdown && exam_meta_data && JSON.parse(exam_meta_data).submitted==false) {
        this.remainingTimeCalculator();
      }
    }
    this.examService.getExamInfo.subscribe((examinfo: any) => {
      this.examInfo = examinfo;
      
    })

    this.examService.testBegins.subscribe((begins: any) => {
      if (this.timeInterval) {
        this.closeinterval();
      }
      this.storage.store('examcountdown', this.examInfo.duration);
      this.remainingTimeCalculator();
    });
    // this.examInfo.isexamstrated = false;
    this.examInfo.isexamstrated = this.authService.isExamStarted.subscribe(ex => this.examInfo.isexamstrated = ex)
  }

  ngOnInit(): void {
    // this.examInfo.isexamstrated = false;
    this.authService.setIsExamStarted(false);
    
    let exam_meta_data: any = localStorage.getItem('exam_meta_data');
    if (exam_meta_data) {
      this.examService.updatedExamMetaDataSource(JSON.parse(exam_meta_data));
    }

    this.examService.examMetaData.subscribe((data) => {
      console.log(data);
      if (data && data.submitted==false && data.started && data.started==true) {
        this.is_exam_started = true;
      }
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd ) {
        this.current_route_url = event.url;
      }
    });

  }

  loadUser(): void {
    this.userService.loadUserDetails(this.userId).subscribe((data) => {
      console.log((data));
      this.user = data;
      this.profilePhoto = data.profilePhoto
    });
  }

  remainingTimeCalculator() {
    this.counter = this.storage.retrieve('examcountdown');
    if(!this.counter) {
      this.counter = Number(this.examInfo.duration);
    }
    // this.counter = Number(this.examInfo.duration) - this.counter;
    //this.timer_ticker = parseInt('' + (1 * Number(this.counter)) / 60) + ':' + (Number(this.counter) % 60);
    
    var time_in_seconds = parseFloat(this.counter) * 60;
    if (time_in_seconds>0) {
      this.timer_ticker = new Date(time_in_seconds * 1000).toISOString().substr(11, 8);
    }
    

    this.timeInterval = setInterval(() => {


      time_in_seconds--
      this.storage.store('examcountdown', time_in_seconds / 60);
      
      
      if (time_in_seconds <301) {
        this.timerWarning = true;
      } else {
        this.timerWarning = false;
      }
      if (time_in_seconds === 0) {
        this.closeinterval();
        this.reviewSubmit();
      }
      if (time_in_seconds>0) {
        this.timer_ticker = new Date(time_in_seconds * 1000).toISOString().substr(11, 8);
      }
      

    }, 1000);
  }

  closeinterval() {
    clearInterval(this.timeInterval)
  }

  login() {
    const config: MatDialogConfig = {
      width: '439px',
      // height: '226px',
      data: { message: 'Hey, ready to get started?' }
    };
    const dialogRef = this.dialog.open(LogindialogComponent, config);
  }

  reviewSubmit(){
    const config: MatDialogConfig = {
      width: '487px',
      // height: '226px',
      data: { message: 'Are you sure you want to submit?' }
    };
    const dialogRef = this.dialog.open(SubmitReviewComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'submitted'){
        this.submitTest()
      } else {
        this.submitTest()
      }
    });
  }

  confirmingSubmit() {
    this.pauseTimer();
    const config: MatDialogConfig = {
       width: '487px',
      // height: '226px',
      data: { message: 'Are you sure you want to submit?' }
    };
    const dialogRef = this.dialog.open(SubmitConfirmationComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'finish'){
        this.reviewSubmit();
      } else {
        this.resumeTimer();
      }
    });
  }


  pauseTimer() {
    this.closeinterval();
  }

  resumeTimer() {
    this.counter = this.storage.retrieve('examcountdown');
    if(!this.counter) {
      this.counter = Number(this.examInfo.duration);
    }
    
    var time_in_seconds = parseFloat(this.counter) * 60;
    this.timer_ticker=new Date(time_in_seconds * 1000).toISOString().substr(11, 8)

    this.timeInterval = setInterval(() => {

      time_in_seconds--
      this.storage.store('examcountdown', time_in_seconds / 60);
      this.timer_ticker = new Date(time_in_seconds * 1000).toISOString().substr(11, 8);
      if (time_in_seconds <6) {
        this.timerWarning = true;
      } else {
        this.timerWarning = false;
      }
      if (time_in_seconds === 0) {
        this.closeinterval();
        this.reviewSubmit();
      }
    }, 1000);
  }

  submitTest() {
    this.closeinterval();
    
    this.examInfo.isexamstrated = false;
    this.examService.triggerSubmitExam();
    let exam_meta_data: any = localStorage.getItem('exam_meta_data');
    if (exam_meta_data) {
      localStorage.removeItem("exam_meta_data");
      localStorage.setItem("exam_meta_data",JSON.stringify({...JSON.parse(exam_meta_data),submitted:true}))
      this.examService.updatedExamMetaDataSource({...JSON.parse(exam_meta_data),submitted:true});
    }
  }

  showMyProfile() : void {
    this.router.navigate(['myprofile']);
  }

  logout(): void {

    this.closeinterval();
    let examcountdown = this.storage.retrieve('examcountdown');
    if (examcountdown) {
      this.storage.clear('examcountdown');
    }

    localStorage.clear();
    this.authService.updateAuthStatus(false);
    this.router.navigate(['']);
  }

  setDefaultPic() {
    this.profilePhoto = "../../../../../../assets/img/empty-profile.svg";
  }

  goToInstructionPage() {
    this.router.navigateByUrl('/dashboard/testinstructions');
  }
}
