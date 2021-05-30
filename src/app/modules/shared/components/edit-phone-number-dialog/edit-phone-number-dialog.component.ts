import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignupService } from '@app-services/signup/signup.service';
import { UserService } from '@app-services/user/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { VerifyOtpDialogComponent } from '../verify-otp-dialog/verify-otp-dialog.component';

@Component({
  selector: 'app-edit-phone-number-dialog',
  templateUrl: './edit-phone-number-dialog.component.html',
  styleUrls: ['./edit-phone-number-dialog.component.css']
})
export class EditPhoneNumberDialogComponent implements OnInit {

  phoneForm!: FormGroup;
  phoneNumber!: string;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phoneFormat: any;
  phoneObject: any;
  errorMessage: any;

  constructor(public signUpService: SignupService,
              public userService: UserService,
              private _formBuilder: FormBuilder,
              public router: Router,
              private dialog: MatDialog, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EditPhoneNumberDialogComponent>) {
              this.dialogRef.disableClose = true;
               }

  ngOnInit(): void {
    console.log('data', this.data);
    this.createPhoneForm();
  }

  createPhoneForm(): void {
    this.phoneForm = this._formBuilder.group({
      phone: [null, [Validators.minLength(10)]]
    })
  }

  verifyAndUpdate() {
    console.log('formatted phoneNumber', Number(this.phoneForm.value.phone.number.replace(/\s/g, "")))
    this.phoneObject = this.phoneForm.value.phone
    this.phoneFormat = Number(this.phoneForm.value.phone.number.replace(/\s/g, ""))
    this.changePhoneNumber(this.data.userObject.id,this.phoneFormat)
  }

  changePhoneNumber(userId: any, phoneNumber: string): any {
    this.userService.checkMobileNumber(userId, phoneNumber).subscribe((data: any) => {
      if(data === true){
        this.sendOtp(this.phoneFormat, this.data.isdCode);
      }
    },
      (error) => {                                     // on error
        console.log('check mobile error', error);
        this.errorMessage = error.error.message
      });
  }

  sendOtp(phone: any, countryCode: string): any {
    this.signUpService.sendOtp(phone, countryCode).subscribe((data: any) => {
      this.dialogRef.close(`${phone}`);
      localStorage.setItem('editMob', phone);
      this.openVerifyOtpDialogToValidatePhoneNumber({ phone: this.phoneFormat }, this.data.isdCode)
    },
      (error) => {                                     // on error
        console.log('sendOtp error', error);
      });
  }

  openVerifyOtpDialogToValidatePhoneNumber(formValue: any, countryCode: string): any {
    const config: MatDialogConfig = {
      width: '500px',
      data: {
        message: 'Verify OTP', message2: `Please verify the OTP sent to ${this.phoneObject.dialCode} ${this.phoneFormat}`,
        countryCode: this.data.isdCode, phone: this.phoneFormat,
        isEditPhoneNumber: true, userObject: this.data.userObject
      }
    };
    const dialogRef = this.dialog.open(VerifyOtpDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('value', value)
        // this.dialogRef.close(`${this.phoneFormat}`);
      }
    });
  }

  enterKey(event: any): void {
    if (event.keyCode == 13 && event.target.value.length===10) {
      this.verifyAndUpdate();
    }
  }

  closeDialogue() {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

}