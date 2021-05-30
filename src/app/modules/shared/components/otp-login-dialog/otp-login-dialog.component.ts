import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { SignupService } from '@app-services/signup/signup.service';
import { PasswordLoginDialogComponent } from '../password-login-dialog/password-login-dialog.component';
import { VerifyOtpDialogComponent } from '../verify-otp-dialog/verify-otp-dialog.component';

@Component({
  selector: 'app-otp-login-dialog',
  templateUrl: './otp-login-dialog.component.html',
  styleUrls: ['./otp-login-dialog.component.css']
})
export class OtpLoginDialogComponent implements OnInit {
  otpForm!: FormGroup;
  phoneNumber!: string;

  constructor(private dialog: MatDialog, private _formBuilder:FormBuilder,
    public signUpService: SignupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OtpLoginDialogComponent>) {
      // this.otpForm=fb.group({
      //   phone:[''],
      // })
     }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    console.log('data', this.data);
    this.phoneNumber = this.data.countryCode +' '+ this.data.phone;
    this.createOtpForm();
    if (this.data.phone) {
      this.setOtpForm();
    }
  }

  createOtpForm(): void {
    this.otpForm = this._formBuilder.group({
      phone: [null],
    })
  }
  setOtpForm(): void {
    this.otpForm = this._formBuilder.group({
      phone: [this.phoneNumber],
    });
  }

  passwordLogin() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'Password Login', message2: 'Please enter your registered phone number and password to get started',
              countryCode: this.data.countryCode, phone: this.data.phone }
    };
    const dialogRef = this.dialog.open(PasswordLoginDialogComponent, config);
  }

  sendOtp() {
    this.dialogRef.close();
    this.register({phone: this.data.phone}, this.data.countryCode)
    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'Verify OTP', message2: `Please verify the OTP sent to ${this.phoneNumber}`,
              countryCode: this.data.countryCode, phone: this.data.phone,
              isLoginWithOtp: true }
    };
    const dialogRef = this.dialog.open(VerifyOtpDialogComponent, config);
  }

  register(formValue: any, countryCode: string): any {
    this.signUpService.signUp(formValue, countryCode).subscribe((data:any) => {
      // this.toastr.success(data.message);
      // console.log(data);
      // if (data) {
      //   this.dialogRef.close();
      //   this.openOTPVerificationPopup();
      // } else { }

    },
      (error) => {                                     // on error
        // this.toastr.warning(error.error.message)
        console.log(error);
      });
  }
  closeDialogue() {
    this.dialogRef.close();
  }
}
