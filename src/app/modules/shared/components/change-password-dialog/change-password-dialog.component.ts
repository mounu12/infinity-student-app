import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GradesdialogComponent } from '../gradesdialog/gradesdialog.component';
import { OtpverificationdialogComponent } from '../otpverificationdialog/otpverificationdialog.component';
import { Router } from '@angular/router';
import { UserService } from '@app-services/user/user.service';
import { ChangePasswordViaOtpDialogComponent } from '../change-password-via-otp-dialog/change-password-via-otp-dialog.component';
import { ConfirmEditPhoneNumberDialogComponent } from '../confirm-edit-phone-number-dialog/confirm-edit-phone-number-dialog.component';


@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})

export class ChangePasswordDialogComponent implements OnInit {
  passwordForm:any;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  constructor(private dialog: MatDialog,private _formBuilder:FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService,
              private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
              public router: Router) {
      // dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    // this.dialogRef.disableClose = true;
    console.log('data', this.data);
    this.createPasswordForm();
    if (this.data.password) {
       this.setPasswordForm();
    }
  }

  createPasswordForm(): void {
    this.passwordForm = this._formBuilder.group({
      currentPassword: ['', [Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  setPasswordForm(): void {
    this.passwordForm = this._formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get p() { return this.passwordForm.controls; }

  confirmPassword() {
    this.passwordForm.markAllAsTouched();
    if(this.passwordForm.valid){
      const obj = this.data.userObject;
      // obj.password = this.passwordForm.value.newPassword
      const password = this.passwordForm.value.newPassword
      this.userService.updatePassword(password,obj.id).subscribe((data: any) => {
        this.dialogRef.close(`${password}`);
        // this.router.navigate(['myprofile']);
        this.openPhoneNumberUpdatedConfirmDialog(password)
      },
      (error: any) => {                                     // on error
        alert(error.error.message);
      });
    }
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

  changePasswordViaOtp(): void {
    // this.dialogRef.close('a')
    const config: MatDialogConfig = {
      width: '570px',
      //height:'398px',
      data: { message: 'Change password',
      userObject: this.data.userObject  }
    };
    const dialogRef = this.dialog.open(ChangePasswordViaOtpDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('v', value)
        this.dialogRef.close(value);
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
