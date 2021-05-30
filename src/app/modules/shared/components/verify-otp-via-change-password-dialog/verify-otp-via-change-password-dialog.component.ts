import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignupService } from '@app-services/signup/signup.service';
import { UserService } from '@app-services/user/user.service';
import { LogindialogComponent } from '../logindialog/logindialog.component';
import { OtpLoginDialogComponent } from '../otp-login-dialog/otp-login-dialog.component';
import { SetnewPasswordDialogComponent } from '../setnew-password-dialog/setnew-password-dialog.component';
import { TestlistService } from '@app-services/test/testlist.service';
import { ConfirmEditPhoneNumberDialogComponent } from '../confirm-edit-phone-number-dialog/confirm-edit-phone-number-dialog.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-verify-otp-via-change-password-dialog',
  templateUrl: './verify-otp-via-change-password-dialog.component.html',
  styleUrls: ['./verify-otp-via-change-password-dialog.component.css']
})
export class VerifyOtpViaChangePasswordDialogComponent implements AfterViewInit {
  seconds:number= 60;
  counter: any;
  hideVerifyOtp = false;
  form: FormGroup;
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  timer: any;
  errorMessage: any;
  userData: any;
  count = 0;
  validateOtpCounter = 0;

  constructor(public signUpService: SignupService,
    private userService: UserService,
    public router: Router,
    private testListService: TestlistService,
    private dialog: MatDialog, private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VerifyOtpViaChangePasswordDialogComponent>,
    private dialogRef2: MatDialogRef<ChangePasswordDialogComponent>) {
      this.form=fb.group({
        otp:[null],
      });
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
    this.userData = this.data;
    console.log(this.userData);
    this.form=this.fb.group({
      otp:[null],
    });
    this.dialogRef.disableClose = true;
  }
  onOtpChange(event:any){
    // this.ngOtpInputRef.setValue(event);//yourvalue can be any string or number eg. 1234 or '1234'
    if(event.length===4) {
      this.form.get('otp')?.setValue(event);
      document.getElementById('verifyOtp')?.focus();

    }
  }

  validateOtp(): void {
    // console.log(this.form)
    this.signUpService.validateOtp(this.data.countryCode,this.data.phone,this.form.value.otp).subscribe((data) => {
      // this.toastr.success(data.message);
      if(data.accessToken){
        console.log('JWT token',data);
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('tenant', data.tenantName);
        this.userService.setMobileAndName({mobile: data.userDto.phoneNumber, ISD: data.userDto.isdCode, firstName: data.userDto.firstName, lastName: data.userDto.lastName, 
          isWhatsappConsent: data.userDto.whatsappConsent, userId: data.userDto.id, profilePhoto:data.userDto.profilePhoto});
        // this.openAccountConfirmDialog();
        this.editPassword(this.data.userObject, this.data.password)
        // if(this.data.isLoginWithOtp){
        // this.dialogRef.close()
        // localStorage.setItem('studentid', this.data.phone)
        // //this.router.navigate(['dashboard']);
        //  let _headers = {
        //   'accesstoken': data.accessToken,
        //   'studentid':  localStorage.getItem('studentid'),
        //   // 'methodtype': 'RULES'
        // };
        // // this.test(_headers);
        // } else {
        //   this.dialogRef.close(true)
        // }
      }
    },
      (error) => {                                     // on error
        // this.toastr.warning(error.error.message)
        this.errorMessage = error.error.message
        // alert(error.error.message);
        // this.openOTPVerificationPopup();
      });

  }

editPassword(val: any, password: any): any {
    const obj = val;
    this.userService.updatePassword(password,obj.id).subscribe((data: any) => {
    this.dialogRef.close(`${password}`);
    this.openPhoneNumberUpdatedConfirmDialog(password);
      // this.router.navigate(['myprofile']);
    },
    (error: any) => {                                     // on error
      alert(error.error.message);
    });
}

openPhoneNumberUpdatedConfirmDialog(password: any) {
  // localStorage.setItem('token', val.accessToken)
  const config: MatDialogConfig = {
    width: '487px',
    height: '292px',
    data: { message: 'Password updated', message2: `Your have changed your password successfully` }
  };
  const dialogRef = this.dialog.open(ConfirmEditPhoneNumberDialogComponent, config);
  dialogRef.afterClosed().subscribe((value) => {
    if (value === true) {
      console.log('v', value)
    this.dialogRef.close(`${password}`);
    this.dialog.closeAll()
      // this.router.navigate(['myprofile'])
    }
  });
}

  verifyOtp(): void {
    if (this.form.value) {
      this.dialogRef.close(this.form.value);
    } else {
    }
  }

  editMobileNumber() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      // width: '487px',
      // height: '226px',
      data: { message: 'Hey, ready to get started?' }
    };
    const dialogRef = this.dialog.open(LogindialogComponent, config);
  }

  onConfigChange(val: boolean) {
    console.log(val);
    this.config.isPasswordInput = val;
  }
 startCountdown(seconds : any) {

    this.counter = seconds;

    const interval = setInterval(() => {
      this.counter--;


      if (this.counter == 0) {
       this.hideVerifyOtp = true;
        clearInterval(interval);
        document.getElementById('resendOtp')?.focus()
      }
      if(this.counter < 10) {
        this.counter = '0'+this.counter
      }
    }, 1000);


  }
  resendOTP() {
    if(this.count >= 25){
      alert('You have reached maximum of 5 attempts')
    } else {
    this.signUpService.signUp(this.userData, this.userData.countryCode).subscribe((data:any) => {
      console.log(data);
      this.count = this.count + 1;
      this.startCountdown(this.seconds);
      this.hideVerifyOtp = false;
      // document.getElementById('otpboxes')?.focus();
    });
  }
  }

  ngAfterViewInit(): void {
    this.startCountdown(this.seconds);
  }

  closeDialogue() {
    this.dialogRef.close();
  }
}

