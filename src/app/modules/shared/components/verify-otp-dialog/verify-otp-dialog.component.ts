import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignupService } from '@app-services/signup/signup.service';
import { UserService } from '@app-services/user/user.service';
import { SetnewPasswordDialogComponent } from '../setnew-password-dialog/setnew-password-dialog.component';
import { TestlistService } from '@app-services/test/testlist.service';
import { ConfirmEditPhoneNumberDialogComponent } from '../confirm-edit-phone-number-dialog/confirm-edit-phone-number-dialog.component';
import { EditPhoneNumberDialogComponent } from '../edit-phone-number-dialog/edit-phone-number-dialog.component';
import { LogindialogComponent } from '../logindialog/logindialog.component';

@Component({
  selector: 'app-verify-otp-dialog',
  templateUrl: './verify-otp-dialog.component.html',
  styleUrls: ['./verify-otp-dialog.component.css']
})
export class VerifyOtpDialogComponent implements AfterViewInit {

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

  constructor(
    public signUpService: SignupService,
    private userService: UserService,
    private testListService: TestlistService,
    private fb:FormBuilder,
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VerifyOtpDialogComponent>) {
      this.form=fb.group({
        otp:[null],
      });
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
    this.startCountdown(this.seconds);
    this.userData = this.data;
    console.log('dialogData', this.userData);
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
    this.signUpService.validateOtp(this.data.countryCode,this.data.phone,this.form.value.otp).subscribe((data) => {
      // this.toastr.success(data.message);
      if(data.accessToken){
        console.log('JWT token',data);
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('tenant', data.tenantName);
        this.userService.setMobileAndName({mobile: data.userDto.phoneNumber, ISD: data.userDto.isdCode, firstName: data.userDto.firstName, lastName: data.userDto.lastName, 
          isWhatsappConsent: data.userDto.whatsappConsent, userId: data.userDto.id, profilePhoto:data.userDto.profilePhoto});
        // this.openAccountConfirmDialog();
        if(this.data.isLoginWithOtp){
        this.dialogRef.close()
        localStorage.setItem('studentid', this.data.phone)
        //this.router.navigate(['dashboard']);
         let _headers = {
          'accesstoken': data.accessToken,
          'studentid':  localStorage.getItem('studentid'),
          // 'methodtype': 'RULES'
        };
        this.saveAccessToken(_headers);
        } else {
          this.dialogRef.close(true)
        }

        if(data.accessToken && this.data.isEditPhoneNumber){
          // this.dialogRef.close();
          // this.validatePhoneNumber(this.data.phone)
          // this.editPhoneNumber(this.data.userObject)
          } else {
            this.dialogRef.close(true)
          }

        if(data.accessToken && this.data.isForgotPassword){
          // this.dialogRef.close();
          this.openSetNewPasswordDialog()  
          } else {
            this.dialogRef.close(true)
          }
      }
    },
      (error) => {                                     // on error
        // this.toastr.warning(error.error.message)
        this.errorMessage = error.error.message
        // alert(error.error.message);
        // this.openOTPVerificationPopup();
      });
  }

  validateOtp2(): void {
    this.signUpService.validatePhoneNumber(this.data.phone, this.form.value.otp).subscribe((data:any) => {
      if(data){
        // this.test1()
        // this.dialogRef.close(`${this.data.phone}`);
        this.editPhoneNumber(this.data.userObject)
      } else if(data === false){
        this.errorMessage = 'The OTP is incorrect, please enter again'
      }
    },
      (error: any) => {                                     // on error
        console.log(error);
      });
  }

  validateOtpForForgotPassword(): void {
    this.signUpService.validateOtpForForgotPassword(this.data.countryCode,this.data.phone, this.form.value.otp).subscribe((data:any) => {
      if(data){
        this.openSetNewPasswordDialog()
      }
    },
      (error: any) => {                                     // on error
        console.log(error);
        this.errorMessage = 'The OTP is incorrect, please enter again'
      });
  }

  test1(): void {
    this.signUpService.validateOtp(this.data.countryCode,this.data.phone,this.form.value.otp).subscribe((data) => {
      // this.toastr.success(data.message);
      if(data.accessToken){
        console.log('JWT token',data);
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('tenant', data.tenantName);
        this.userService.setMobileAndName({mobile: data.userDto.phoneNumber, ISD: data.userDto.isdCode, firstName: data.userDto.firstName, lastName: data.userDto.lastName, 
          isWhatsappConsent: data.userDto.whatsappConsent, userId: data.userDto.id, profilePhoto:data.userDto.profilePhoto});
        // this.openAccountConfirmDialog();
        if(this.data.isLoginWithOtp){
        this.dialogRef.close()
        localStorage.setItem('studentid', this.data.phone)
        //this.router.navigate(['dashboard']);
         let _headers = {
          'accesstoken': data.accessToken,
          'studentid':  localStorage.getItem('studentid'),
          // 'methodtype': 'RULES'
        };
        
        this.saveAccessToken(_headers);
        } else {
          this.dialogRef.close(true)
        }

        if(data.accessToken && this.data.isEditPhoneNumber){
          // this.dialogRef.close();
          // this.validatePhoneNumber(this.data.phone)
          this.editPhoneNumber(this.data.userObject)
          
          } else {
            this.dialogRef.close(true)
          }

          if(data.accessToken && this.data.isForgotPassword){
            // this.dialogRef.close();
            this.openSetNewPasswordDialog()
            
            } else {
              this.dialogRef.close(true)
            }
      }
    },
      (error) => {                                     // on error
        // this.toastr.warning(error.error.message)
        this.errorMessage = error.error.message
        // alert(error.error.message);
        // this.openOTPVerificationPopup();
      });
  }

  saveAccessToken(_headers: any): any {
    this.testListService.saveToken({},_headers).subscribe((data:any) => {
    console.log('saveToken success', data);
    this.router.navigate(['dashboard'])
    },
    (error) => {                                     // on error
    console.log(error);
    });
}

// validatePhoneNumber(formValue: any): any {
//   this.signUpService.validatePhoneNumber(formValue, this.form.value.otp).subscribe((data:any) => {
//     if(data){
//       this.editPhoneNumber(this.data.userObject)
//     }
//   },
//     (error: any) => {                                     // on error
//       console.log(error);
//     });
// }

editPhoneNumber(value: any): any {
  const obj = value;
  // obj.phoneNumber = this.data.phone
  // this.userService.updateUserDetails(obj).subscribe((data:any) => {
  //   console.log(data);
  //   // this.router.navigate(['dashboard'])
  //   this.openPhoneNumberUpdatedConfirmDialog(data);
  // },
  //   (error) => {                                     // on error
  //     // alert(error.error.message);
  //   });
  this.openPhoneNumberUpdatedConfirmDialog(this.data.phone);
}

openPhoneNumberUpdatedConfirmDialog(val: any) {
  // localStorage.setItem('token', val.accessToken)
  this.dialogRef.close()
  const config: MatDialogConfig = {
    width: '487px',
    height: '258px',
    data: { message: 'Phone number updated', 
            message2: `Your phone number has been updated to ${val}` }
    };
  const dialogRef = this.dialog.open(ConfirmEditPhoneNumberDialogComponent, config);
  dialogRef.afterClosed().subscribe((value) => {
    if (value === true) {
      console.log('value', value)
      this.dialogRef.close(`${this.data.phone}`);
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
      width: '487px',
      height:'295px',
      data: { message: 'Edit Phone Number',
              isEditVerifyOtp: true
      }
    };
    const dialogRef = this.dialog.open(EditPhoneNumberDialogComponent, config);
  }

  editMobileNumber2() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '487px',
      height:'295px',
      data: { message: 'Edit Phone Number',
              isEditVerifyOtp: true
      }
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

  // verifyOtp() {
  //   // this.dialogRef.close();
  //   // const config: MatDialogConfig = {
  //   //   width: '439px',
  //   //   data: { message: 'Phone Number Verified', message2: 'Please set a new password for your account' }
  //   // };
  //   // const dialogRef = this.dialog.open(SetnewPasswordDialogComponent, config);
  // }

  openSetNewPasswordDialog(val?: any) {
    // localStorage.setItem('token', val.accessToken)
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '439px',
      height: '340px',
      data: { message: 'Phone Number Verified', 
              message2: `Please set a new password for your account`,
              countryCode: this.data.countryCode, 
              phone: this.data.phone }
      };
    const dialogRef = this.dialog.open(SetnewPasswordDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('value', value)
        // this.router.navigate(['myprofile'])
      }
    });
  }

  closeDialogue() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    // this.startCountdown(this.seconds);
  }

}
