import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GradesdialogComponent } from '../gradesdialog/gradesdialog.component';
import { OtpverificationdialogComponent } from '../otpverificationdialog/otpverificationdialog.component';
import { Router } from '@angular/router';
import { UserService } from '@app-services/user/user.service';
import { VerifyOtpDialogComponent } from '../verify-otp-dialog/verify-otp-dialog.component';
import { VerifyOtpViaChangePasswordDialogComponent } from '../verify-otp-via-change-password-dialog/verify-otp-via-change-password-dialog.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { SignupService } from '@app-services/signup/signup.service';
import { AuthService } from '@app-core/components/auth-service/auth.service';


@Component({
  selector: 'app-change-password-via-otp-dialog',
  templateUrl: './change-password-via-otp-dialog.component.html',
  styleUrls: ['./change-password-via-otp-dialog.component.css']
})
export class ChangePasswordViaOtpDialogComponent implements OnInit {
  passwordForm:any;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  constructor(private dialog: MatDialog,private _formBuilder:FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService,
              private authService: AuthService,
              public signUpService: SignupService,
              private dialogRef: MatDialogRef<ChangePasswordViaOtpDialogComponent>,
              private dialogRef2: MatDialogRef<ChangePasswordDialogComponent>,
              public router: Router) {
      // dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    // this.dialogRef.disableClose = true;
    console.log('data', this.data);
    this.createPasswordForm();
    // if (this.data.password) {
    //    this.setPasswordForm();
    // }
  }

  createPasswordForm(): void {
    this.passwordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  // setPasswordForm(): void {
  //   this.passwordForm = this._formBuilder.group({
  //     newPassword: [this.data.newPassword ||  '', [Validators.required, Validators.minLength(6)]],
  //     confirmPassword: [this.data.confirmPassword || '', [Validators.required, Validators.minLength(6)]]
  //   })
  // }

  get p() { return this.passwordForm.controls; }

  sendOtp(): any {
    this.passwordForm.markAllAsTouched()
    if(this.passwordForm.valid){
      this.dialogRef.close(this.passwordForm.value.newPassword);
      const obj = {
        phone: this.data.userObject.phoneNumber,
        countryCode: this.data.userObject.isdCode
      }
      this.signUpService.signUp(obj, obj.countryCode).subscribe((data:any) => {
        // this.toastr.success(data.message);
        console.log(data);
        if (data) {
          // this.dialogRef.close(this.passwordForm.value.newPassword);
          this.openOTPVerificationPopup();
        } else { }
  
      },
        (error) => {                                     // on error
          // this.toastr.warning(error.error.message)
          console.log(error);
        });
    }
  }

  openOTPVerificationPopup(): void {
    this.dialogRef2.close(this.passwordForm.value.newPassword)
    const config: MatDialogConfig = {
      width: '450px',
      // height:'480px',
      data: {
      // password: this.userForm.value.password,
      // userObject: this.userForm.value
      message: 'Verify OTP', message2: `Please verify the OTP sent to the number ${this.data.userObject.isdCode} ${this.data.userObject.phoneNumber}`,
              countryCode: this.data.userObject.isdCode, phone: this.data.userObject.phoneNumber,
              userObject: this.data.userObject, password: this.passwordForm.value.newPassword
    }
    };
    
    const dialogRef = this.dialog.open(VerifyOtpViaChangePasswordDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('v', value)
        const pass_key = localStorage.setItem('pass_key', value)
        this.dialogRef2.close(this.passwordForm.value.newPassword);
        this.authService.setPasskey(pass_key)
        // this.userForm?.get('password')?.setValue(value);
        // this.loadUser()
      }
    });
  }

  changePasswordViaEmail(): void {
    // this.dialogRef.close('b')
    const config: MatDialogConfig = {
      width: '570px',
      // height:'595px',
      data: { message: 'Change password' ,
      password: this.data.userObject.password,
      userObject: this.data.userObject
    }
    };
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('v', value)
        // this.userForm?.get('password')?.setValue(value);
        // this.loadUser()
      }
    });
  }
  

  showPassword(): void {
    this.show_button = !this.show_button;
  }

  showConfirmPassword(): void {
    this.show_eye = !this.show_eye;
  }

  isPasswordEqualToConfirmPassword(): boolean {
    if(this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword){
      return true
    }
     else return false;
  }

}
