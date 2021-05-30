import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { SignupService } from '@app-services/signup/signup.service';
import { VerifyOtpDialogComponent } from '../verify-otp-dialog/verify-otp-dialog.component';


@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css']
})
export class ForgotPasswordDialogComponent implements OnInit {
  forgotForm!: FormGroup;
  phoneNumber!: string;
  constructor(private dialog: MatDialog, private _formBuilder:FormBuilder,public signUpService: SignupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>) {
      // this.form=fb.group({
      //   phone:['']
      // })
     }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    console.log('data',this.data)
    this.phoneNumber = this.data.countryCode +' '+ this.data.phone;
    this.createForgotForm();
    if (this.data.phone) {
      this.setForgotForm();
    }
  }

  createForgotForm(): void {
    this.forgotForm = this._formBuilder.group({
      phone: [null],
    })
  }
  setForgotForm(): void {
    this.forgotForm = this._formBuilder.group({
      phone: [this.phoneNumber],
    });
  }

  sendOtp() {
    // this.forgotForm.get('phone')?.setValue(parseInt(this.data.phone.replace(/ /g, "")));
    this.forgotForm.get('phone')?.setValue(this.data.phone);
    this.signUpService.signUp(this.forgotForm.value, this.data.countryCode).subscribe((data:any) => {
      console.log(data);
      this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'Verify OTP', message2: `Please verify the OTP sent to ${this.phoneNumber}`,
              countryCode: this.data.countryCode,
              phone: this.forgotForm.value.phone, 
              isForgotPassword: true}
    };
    const dialogRef = this.dialog.open(VerifyOtpDialogComponent, config);
    });
    
  }

  closeDialogue() {
    this.dialogRef.close();
  }

}
