import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BoardsService } from '@app-services/boarrds/boards.service';
import { SignupService } from '@app-services/signup/signup.service';
import { TestlistService } from '@app-services/test/testlist.service';
import { UserService } from '@app-services/user/user.service';
import { BoardsDialogComponent } from '../boards-dialog/boards-dialog.component';

@Component({
  selector: 'app-exam-dialog',
  templateUrl: './exam-dialog.component.html',
  styleUrls: ['./exam-dialog.component.css']
})
export class ExamDialogComponent implements OnInit {
  examForm: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  searchIndices: any = [];
  allSearchIndices: any = [];
  selectedExams: any = [];
  greenTickPath = '../../../../../assets/img/green-tick-icon.svg';
  greyTickPath = '../../../../../assets/img/grey-tick-icon.svg';
  exams:any = [];
  user:any;
  exams1: any = [];

  constructor(private dialogRef: MatDialogRef<ExamDialogComponent>, private dialog: MatDialog, private _formBuilder: FormBuilder, private targetExamService: BoardsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, public signUpService: SignupService, private router: Router,private testListService: TestlistService) {
      dialogRef.disableClose = !this.data.isExamEdit;
  }

  ngOnInit(): void {
    console.log('diaalog data', this.data);
    this.getTargetExamsList();
    this.createRolesForm();
    if (this.data.examsData) {
      this.createRolesForm();
      this.exams1 = this.data.examsData;
      this.setRolesForm();
    }
  }

  getTargetExamsList() {
    this.targetExamService.getTargetExamList().subscribe((data: any) => {
      this.exams = data;
      console.log('exams', this.exams)
      this.examsSelected()
      for(let i =0, len = data.length; i < len; i++ ) {
        this.searchIndices.push(i);
      }
      this.allSearchIndices = this.searchIndices;
    });
  }

  examsSelected(): void {
  console.log(this.exams, this.exams1)
  let result = this.exams1.filter((o1: any) => this.exams.some((o2: any) => o1.id === o2.id));
  console.log('result', result)
    for(let i =0, len = this.exams.length; i< len; i++ ) {
        for(let j =0, len = this.exams1.length; j< len; j++ ) {
              if(this.exams1[j].id === this.exams[i].id){
                this.selectExam(i)
              }
      }
  }
}

  createRolesForm(): void {
    this.examForm = this._formBuilder.group({
      description: [''],
      examsimage: [''],
      id: [''],
      targetExam: [''],
    });
  }

  setRolesForm(): void {
    this.examForm = this._formBuilder.group({
      description: [this.exams.description],
      examsimage: [this.exams.examsimage],
      id: [this.exams.id],
      targetExam: [this.exams.targetExam],
    });
  }

  selectExam(i: any) {
    this.selectedExams[i] = !this.selectedExams[i]
  }

  searchExams(event: KeyboardEvent) {
    const searchString = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if(searchString == "") {
      this.searchIndices = this.allSearchIndices
    } else {
      const res: any = [];
      const exams = this.exams;
      for(let i = 0, len = exams.length; i < len; i++) {
        if(exams[i].targetExam.toLowerCase().indexOf(searchString) >  -1 || exams[i].description.toLowerCase().indexOf(searchString) > -1) {
          res.push(i);
        } else {
          this.selectedExams[i] = false;
        }
      }
      this.searchIndices = res;
    }
  }

  gotoDashboard() {
    const examsDetails:any = [];
    for(let i =0, len = this.exams.length; i< len; i++ ) {
      if(this.selectedExams[i]) {
        examsDetails.push(this.exams[i]);
      }
    }

    const mobileAndName = this.userService.getMobileAndName();

    const data = {
      personalDetails: {...mobileAndName},
      accountDetails: this.data.accountDetails,
      gradesDetails: this.data.gradesDetails,
      boardsDetails: this.data.boardsDetails,
      examsDetails
    }

    this.userService.setUser(data);
    this.registerUser();
  }

  registerUser(): void {
    this.user = this.userService.getUser();
    const obj = this.formatRegisterObject(this.user);
    this.signUpService.register(obj).subscribe((data: any) => {
      if(data.statuscode === 200){
      }
        this.dialogRef.close();
      //this.router.navigate(['dashboard']);
        let mobile_and_name: any = localStorage.getItem('mobile_and_name');
        let mobile_and_name_obj=JSON.parse(mobile_and_name);
        localStorage.setItem('studentid', mobile_and_name_obj.mobile);
        let _headers = {
          'accesstoken': localStorage.getItem('token'),
          'studentid':  `${mobile_and_name_obj.mobile}`,
          // 'methodtype': 'RULES'
        };
        this.test(_headers);

      },
      (error: any) => {                                     // on error
        alert(error.error.message);
      });
  }

  formatRegisterObject(value:any): any {
    const obj = {
      board: value.boardsDetails,
      email: value.accountDetails.email,
      firstName: value.personalDetails.firstName,
      grade: value.gradesDetails,
      isdCode: value.personalDetails.ISD,
      lastName: value.personalDetails.lastName,
      password: value.accountDetails.password,
      phoneNumber: value.personalDetails.mobile,
      targetexams: value.examsDetails,
      isWhatsappConsent: value.personalDetails.isWhatsappConsent
    }
    return obj;
  }

  goToProfile(): void {
    this.dialogRef.close();
    //this.router.navigate(['dashboard']);
    let mobile_and_name: any = localStorage.getItem('mobile_and_name');
    let mobile_and_name_obj=JSON.parse(mobile_and_name);
    
    localStorage.setItem('studentid', mobile_and_name_obj.mobile);

    let _headers = {
      'accesstoken': localStorage.getItem('token'),
      'studentid':  `${mobile_and_name_obj.mobile}`,
      // 'methodtype': 'RULES'
    };
    
    this.test(_headers);
  }
  showPrevStep() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '570px',
      height: '536px',
      data: {
        message: 'What board are you enrolled in?', message2: `If you can’t find it in the list, enter in the search box`,
        accountDetails: this.data.accountDetails
      }
    };
    const dialogRef = this.dialog.open(BoardsDialogComponent, config);
  }

  onConfirmClick(): void {
    if (this.data.examsData) {
      const examsDetails:any = [];
      for(let i =0, len = this.exams.length; i< len; i++ ) {
        if(this.selectedExams[i]) {
          examsDetails.push(this.exams[i]);
        }
      console.log('selectedExams',this.selectedExams[i], i)
      }
      console.log('examForm', this.examForm, examsDetails)
      this.dialogRef.close(examsDetails);
    }
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  test(_headers: any): any {
  this.testListService.saveToken({},_headers).subscribe((data:any) => {
    console.log(data);
    this.router.navigate(['dashboard'])
  },
    (error:any) => {                                     // on error
      console.log(error);
    });
  }
}
