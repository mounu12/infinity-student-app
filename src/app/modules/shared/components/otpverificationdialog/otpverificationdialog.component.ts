import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GradesdialogComponent } from '../gradesdialog/gradesdialog.component';
import { SetupAccountComponent } from '../setup-account/setup-account.component';

@Component({
  selector: 'app-otpverificationdialog',
  templateUrl: './otpverificationdialog.component.html',
  styleUrls: ['./otpverificationdialog.component.css']
})
export class OtpverificationdialogComponent implements OnInit {
  // otp: string;
  otpForm: any;
  ngOtpInput: any;
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private _formBuilder:FormBuilder,private dialog: MatDialog,
  private dialogRef: MatDialogRef<OtpverificationdialogComponent>)
   { 
    this.otpForm=this._formBuilder.group({
      otp:['',Validators.required]
    })
  }

  ngOnInit(): void {
    console.log('dat', this.data);

  }

  onOtpChange(): any {
    // this.otp = otp;
  }
  verifyOTP() {
    this.dialogRef.close();
    this.gradeSelectionPopup();
  }
  gradeSelectionPopup() {
    const config: MatDialogConfig = {
      width: '450px',
    };
    const dialogRef = this.dialog.open(SetupAccountComponent, config);
  }

  closeDialogue() {
    this.dialogRef.close();
  }
}
