import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from '@app-services/login/login.service';
import { TestlistService } from '@app-services/test/testlist.service';
import { UserService } from '@app-services/user/user.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { LogindialogComponent } from '../logindialog/logindialog.component';
import { OtpLoginDialogComponent } from '../otp-login-dialog/otp-login-dialog.component';

@Component({
  selector: 'app-password-login-dialog',
  templateUrl: './password-login-dialog.component.html',
  styleUrls: ['./password-login-dialog.component.css']
})
export class PasswordLoginDialogComponent implements OnInit {
  loginForm!: FormGroup;
  login: any;
  phoneNumber : any;
  UnauthorizedLoginMessage: any = '';
  show_button: Boolean = false;

  constructor(private dialog: MatDialog, private _formBuilder:FormBuilder,public router: Router,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any, private loginService: LoginService,
    private testListService: TestlistService,
    private dialogRef: MatDialogRef<PasswordLoginDialogComponent>) {
      // this.loginForm=_formBuilder.group({
      //   phone:[''],
      //   password: ['']
      // })
     }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    console.log('data', this.data);
    this.login = this.data;
    this.phoneNumber = this.data.countryCode +' '+ this.data.phone;
    this.createloginForm();
    if (this.data.phone) {
      this.setLoginForm();
    }
  }
  createloginForm(): void {
    this.loginForm = this._formBuilder.group({
      phone: [null, [Validators.required, Validators.minLength(10)]],
      password: ['', Validators.required]
    })
  }
  setLoginForm(): void {
    this.loginForm = this._formBuilder.group({
      phone: [this.phoneNumber, [Validators.required, Validators.minLength(10)]],
      password: [this.login.password || '', [Validators.required]],
    });
    // this.loginForm.markAllAsTouched()
  }

  showPassword(): void {
    this.show_button = !this.show_button;
  }

  get l() { return this.loginForm.controls; }

  forgotPassword() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'Forgot Password', message2: 'Please enter your registered phone number to reset password',
              countryCode: this.data.countryCode, phone: this.data.phone }
    };
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, config);
  }

  loginWithOtp() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'OTP Login', message2: 'Please enter your registered phone number to get started',
              countryCode: this.data.countryCode, phone:  this.data.phone}
    };
    const dialogRef = this.dialog.open(OtpLoginDialogComponent, config);
  }
  loginWithPassword() {
    this.loginForm.markAllAsTouched()
    this.loginForm.get('phone')?.setValue(this.data.phone);
    // console.log(this.loginForm.value, this.loginForm.countryCode);
    // console.log(parseInt(this.data.phone.replace(/ /g, "")));
    if(this.loginForm.valid){
      this.loginPassword(this.loginForm.value, this.login.countryCode)
    }
}
loginPassword(formValue: any, countryCode: string): any {
  this.loginService.login(formValue, countryCode).subscribe((data:any) => {
    // this.toastr.success(data.message);
    console.log(data);
    if (data.accessToken) {
      this.dialogRef.close();
      localStorage.setItem('token', data.accessToken)
      this.userService.setMobileAndName({mobile: data.userDto.phoneNumber, ISD: data.userDto.isdCode, firstName: data.userDto.firstName, lastName: data.userDto.lastName, 
        isWhatsappConsent: data.userDto.whatsappConsent, userId: data.userDto.id,profilePhoto:data.userDto.profilePhoto});
      console.log(formValue);
      localStorage.setItem('studentid', formValue.phone)

        let _headers = {
          'accesstoken': data.accessToken,
          'studentid':  `${formValue.phone}`,
          // 'methodtype': 'RULES'
        };
        
        this.test(_headers);
        // this.router.navigate(['dashboard'])
      // this.openOTPVerificationPopup();
    } else { this.UnauthorizedLoginMessage = 'Incorrect Password! Try again'  }

  },
    (error) => {                                     // on error
      // this.toastr.warning(error.error.message)
      console.log(error);
      this.UnauthorizedLoginMessage = error.error.message
    });
}


  test(_headers: any): any {
  this.testListService.saveToken({},_headers).subscribe((data:any) => {
    console.log(data);
    this.router.navigate(['dashboard'])
  },
    (error) => {                                     // on error
      console.log(error);
    });
  }
  
  closeDialogue() {
    this.dialogRef.close();
  }
  
}
