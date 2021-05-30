import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignupService } from '@app-services/signup/signup.service';
import { UserService } from '@app-services/user/user.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { LogindialogComponent } from '../logindialog/logindialog.component';
import { OtpLoginDialogComponent } from '../otp-login-dialog/otp-login-dialog.component';
import { PasswordLoginDialogComponent } from '../password-login-dialog/password-login-dialog.component';

@Component({
  selector: 'app-setnew-password-dialog',
  templateUrl: './setnew-password-dialog.component.html',
  styleUrls: ['./setnew-password-dialog.component.css']
})
export class SetnewPasswordDialogComponent implements OnInit {

  setPasswordForm!: FormGroup;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  constructor(private dialog: MatDialog, private _formBuilder:FormBuilder,
    public router: Router,
    private userService: UserService,
    private signUpService: SignupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SetnewPasswordDialogComponent>) {}

  ngOnInit(): void {
    // this.dialogRef.disableClose = true;
    console.log('data', this.data);
    this.createPasswordForm();
    if (this.data.password) {
       this.setpasswordForm();
    }
  }

  createPasswordForm(): void {
    this.setPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  setpasswordForm(): void {
    this.setPasswordForm = this._formBuilder.group({
      newPassword: [this.data.newPassword ||  '', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.data.confirmPassword || '', [Validators.required, Validators.minLength(6)]]
    })
  }

  get p() { return this.setPasswordForm.controls; }

  resetPassword() {
    this.setPasswordForm.markAllAsTouched();
    const obj = {
      isdCode: this.data.countryCode,
      phoneNumber: this.data.phone,
      password: this.setPasswordForm.value.newPassword
    };
    this.signUpService.forgotPassword(obj).subscribe((data: any) => {
      this.dialogRef.close();
      // localStorage.setItem('token', data.accessToken)
    this.openPasswordLoginDialog()
    },
    (error: any) => {                                     // on error
      alert(error.error.message);
      this.dialogRef.close();
    });
  } 

  showPassword(): void {
    this.show_button = !this.show_button;
  }

  showConfirmPassword(): void {
    this.show_eye = !this.show_eye;
  }

  isPasswordEqualToConfirmPassword(): boolean {
    if(this.setPasswordForm.value.newPassword === this.setPasswordForm.value.confirmPassword){
      return true
    }
     else return false;
  }

  openPasswordLoginDialog(): void {
    this.dialog.closeAll();
    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'Great! Password has been reset.', message2: 'Please enter your registered phone number and password to get started',
      countryCode: this.data.countryCode, phone: this.data.phone }
    };
    const dialogRef = this.dialog.open(PasswordLoginDialogComponent, config);

  }

}
