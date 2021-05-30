import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { SignupService } from '@app-services/signup/signup.service';

import { SearchCountryField, CountryISO, PhoneNumberFormat, NgxIntlTelInputComponent } from 'ngx-intl-tel-input';
import { PasswordLoginDialogComponent } from '../password-login-dialog/password-login-dialog.component';

import { SignupdialogComponent } from '../signupdialog/signupdialog.component';
import { OtpLoginDialogComponent } from '../otp-login-dialog/otp-login-dialog.component';

@Component({
  selector: 'app-logindialog',
  templateUrl: './logindialog.component.html',
  styleUrls: ['./logindialog.component.css']
})
export class LogindialogComponent implements OnInit {
  @ViewChild(NgxIntlTelInputComponent) telInput: any;
  loginForm!: FormGroup;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  // searchValue: any = '';
  formatPhoneObject: any;
  login: any;
  mobileNumberValid: boolean = false;
  constructor(private dialog: MatDialog, private fb: FormBuilder,
    public signUpService: SignupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LogindialogComponent>) {
  }

  ngOnInit(): void {
    console.log('data', this.data);
    // this.loginForm.get('phone')?.setValue(this.data.phone);
    this.login = this.data;
    this.createLoginForm();
    if(this.data.phone){
      this.setLoginForm()
    }
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      phone: ['']
    })
  }

  setLoginForm(): void {
    this.loginForm = this.fb.group({
      phone: [this.login.phone]
    })
  }

  doSearch(value: any): void {
    this.mobileNumberValid = false;
    // this.searchValue = this.loginForm.value.phone;
    // const phone = this.loginForm.value.phone
    // // console.log('phone', phone)
    // this.formatPhoneObject = {
    //   countryCode: phone?.countryCode,
    //   dialCode: phone?.dialCode,
    //   e164Number: phone?.e164Number,
    //   internationalNumber: phone?.internationalNumber,
    //   nationalNumber: phone?.nationalNumber,
    //   number: this.data.phone ? (phone?.number): Number((phone?.number)?.replace(/\s/g, ""))
    //   // number: (phone?.number)
    // }
    const phone = this.loginForm.value.phone

    if (phone) {
      
      if ( phone.number.includes('-') || phone.number.includes('+') || phone.number.includes("(") || phone.number.includes(")") ) {
        
        let replaced_number = phone.number.replace(/[^0-9]/g,'');
        this.loginForm.controls['phone'].setValue({ ...phone, number: replaced_number });

      } else {
        let number = phone.number;
        let country_code = phone.countryCode;
        //for now we validating indian mobile number manually
        if (country_code=='IN') {
          if (['6','7','8','9'].includes(number.substr(0,1))) {
            this.mobileNumberValid = true;
          }
        }

        this.formatPhoneObject = {
          countryCode: phone.countryCode,
          dialCode: phone.dialCode,
          e164Number: phone.e164Number,
          internationalNumber: phone.internationalNumber,
          nationalNumber: phone.nationalNumber,
          number: Number((phone.number).replace(/\s/g, ""))
        }

      }

    } else {
      if (value) {

        let elementValue = value.srcElement.value;
        elementValue = elementValue.replace(/[^A-Za-z0-9]/g, '');
        value.srcElement.value = elementValue;
        const countrySearchTextLower = elementValue.toLowerCase();
        const country = this.telInput.allCountries.filter((c:any) => {
          if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.All) > -1) {
            // Search in all fields
            if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
              return c;
            }
            if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
              return c;
            }
            if (c.dialCode.startsWith(elementValue)) {
              return c;
            }
          } else {
            // Or search by specific SearchCountryField(s)
            if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.Iso2) > -1) {
              if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
                return c;
              }
            }
            if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.Name) > -1) {
              if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
                return c;
              }
            }
            if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.DialCode) > -1) {
              if (c.dialCode.startsWith(elementValue)) {
                return c;
              }
            }
          }
        });

        const preferred_in_element = this.telInput.countryList?.nativeElement.querySelector('#iti-0__item-in-preferred');
        const preferred_us_element = this.telInput.countryList?.nativeElement.querySelector('#iti-0__item-us-preferred');
        const iti_divider=this.telInput.countryList?.nativeElement.querySelector('.iti__divider');

        if (country.length > 0) {

          if (preferred_in_element) {
            preferred_in_element.style.display = 'none';
           
          }
          if (preferred_us_element) {
             preferred_us_element.style.display = 'none';
          }
          if (iti_divider) {
            iti_divider.style.display = 'none';
          }

          let elementsToShow = country.map((c: any) => c.htmlId);
          this.telInput.allCountries.forEach((c1:any) => {
            if (!elementsToShow.includes(c1.htmlId)) {
              const elToHide = this.telInput.countryList?.nativeElement.querySelector(
              '#' + c1.htmlId
              );
              if (elToHide) {
                elToHide.style.display = 'none';
              }
              
            } else {
              const elToShow = this.telInput.countryList?.nativeElement.querySelector(
              '#' + c1.htmlId
              );
              if (elToShow) {
                elToShow.style.display = 'block';
              }
              
            }
          });


        } else {

          this.telInput.allCountries.forEach((c1:any) => {
            const elToShow = this.telInput.countryList?.nativeElement.querySelector(
            '#' + c1.htmlId
            );
            if (elToShow) {
              elToShow.style.display = 'block';
            }
            
           
          });
        }
       
      }
      
    }











  }

  passwordLogin() {
    this.signUpService.verifyPhoneNumber(this.formatPhoneObject).subscribe((data) => {
      if (data.existingUser === false) {
        this.dialogRef.close();
        this.openSignUpDialog();
      } else if (data.existingUser === true) {
        this.openOTPLoginDialog();
      }
    },
      (error) => {                                     // on error
        // this.errorMessage = error.error.message
      });
  }

  openSignUpDialog(): void {
    const config: MatDialogConfig = {
      width: '450px',
      data: {
        message: `Seems like you're a new user`,
        message2: 'Please enter your name to register',
        phone: this.formatPhoneObject.number,
        countryCode: this.formatPhoneObject.dialCode
      }
    };
    const dialogRef = this.dialog.open(SignupdialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        // this.revokeTokenObject(user_detail._id);
      }
    });
  }

  openOTPLoginDialog() {
    console.log(this.loginForm.value.phone);
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '439px',
      data: { //message: 'Password Login', message2: 'Please enter your registered phone number and password to get started', 
        message: 'OTP Login', message2: 'Please enter your registered phone number to get started',
              phone: this.formatPhoneObject.number, countryCode: this.formatPhoneObject.dialCode }
    };
    const dialogRef = this.dialog.open(OtpLoginDialogComponent, config);
  }

  enterKey(event: any): void {
    if (event.keyCode == 13) {
      this.passwordLogin();
    }
  }
}
