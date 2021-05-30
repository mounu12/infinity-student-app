import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignupService } from 'src/app/services/signup/signup.service';
import { AccountConfirmDialogComponent } from '../account-confirm-dialog/account-confirm-dialog.component';
import { LogindialogComponent } from '../logindialog/logindialog.component';
import { OtpverificationdialogComponent } from '../otpverificationdialog/otpverificationdialog.component';
import { SetupAccountComponent } from '../setup-account/setup-account.component';
import { VerifyOtpDialogComponent } from '../verify-otp-dialog/verify-otp-dialog.component';
import { UserService } from '@app-services/user/user.service';
import { TermsAndConditionsDialogComponent } from '../terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { TestlistService } from '@app-services/test/testlist.service';
import { WhatsAppService } from '@app-services/whatsapp/whats-app.service';

@Component({
  selector: 'app-signupdialog',
  templateUrl: './signupdialog.component.html',
  styleUrls: ['./signupdialog.component.css']
})
export class SignupdialogComponent implements OnInit {

  signupForm!: FormGroup;
  signUp: any;
  phoneNumber!: any;
  validateOtpError: any;

  constructor(public signUpService: SignupService,
    private userService: UserService,
    private testListService: TestlistService,
    private whatsAppService: WhatsAppService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SignupdialogComponent>) {
      dialogRef.disableClose = true;

  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    console.log('data', this.data);
    this.signUp = this.data;
    this.phoneNumber = this.data.countryCode +' '+ this.data.phone;

    this.createSignUpForm();

    if (this.data.phone) {
      this.setSignUpForm();
    }
    // this.register(this.signupForm.value, this.signUp.countryCode)
    // this.test();
    this.clearLocalStorage();
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  createSignUpForm(): void {
    this.signupForm = this._formBuilder.group({
      phone: [null, [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      isWhatsappConsent: [true, [Validators.required]],
      valid: false,
    })
  }

  setSignUpForm(): void {
    this.signupForm = this._formBuilder.group({
      phone: [this.phoneNumber, [Validators.required]],
      firstName: [this.signUp.firstName, [Validators.required]],
      lastName: [this.signUp.lastName, [Validators.required]],
      isWhatsappConsent: [true, [Validators.required]],
      valid:true,
    });
  }

  get s() { return this.signupForm.controls; }

  enterKey(event : any) : void {
    this.signupForm.markAllAsTouched()
    if (event.keyCode === 13 && this.signupForm.valid) {
        this.next();
    }
  }

  checkbox(event: any): any {
    console.log(event);
    this.signupForm.get('isWhatsappConsent')?.setValue(event)
  }

  next(): void {
    this.signupForm.markAllAsTouched()
    this.signupForm.get('phone')?.setValue(this.data.phone);
    // console.log(this.signupForm.value, this.signUp.countryCode);
    // console.log(parseInt(this.data.phone.replace(/ /g, "")));
    if(this.signupForm.valid){
      // tslint:disable-next-line:max-line-length
      this.userService.setMobileAndName({mobile: this.signupForm.value.phone, ISD: this.data.countryCode, firstName: this.signupForm.value.firstName, lastName: this.signupForm.value.lastName, 
                                         isWhatsappConsent: this.signupForm.value.isWhatsappConsent});
      this.register(this.signupForm.value, this.signUp.countryCode)
    }
  }

  register(formValue: any, countryCode: string): any {
    this.signUpService.signUp(formValue, countryCode).subscribe((data:any) => {
      // this.toastr.success(data.message);
      console.log(data);
      if (data) {
        this.dialogRef.close();
        this.openOTPVerificationPopup();
      } else { }

    },
      (error) => {                                     // on error
        // this.toastr.warning(error.error.message)
        console.log(error);
      });
  }

  openOTPVerificationPopup():void {
    const config: MatDialogConfig = {
      width: '450px',
      data: {
        message: 'Verify OTP',
        message2: `Please verify the OTP sent to ${this.signUp.countryCode} ${this.signupForm.value.phone} `,
        totalData: this.signupForm.value,
        countryCode: this.signUp.countryCode,
        phone: this.signupForm.value.phone,
        isNormalFlow: true
      },
      autoFocus: true
    };

    const dialogRef = this.dialog.open(VerifyOtpDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('otp val',value);
        let _headers = {
          'accesstoken': localStorage.getItem('token'),
          'studentid':  `${this.signupForm.value.phone}`,
          // 'methodtype': 'RULES'
        };
        if(this.signupForm.value.isWhatsappConsent){
          this.sendWhatsAppWelcomeMessage()
        }
        this.test(_headers);
        // this.openAccountConfirmDialog();
        // this.verifyOtp(value, this.signUp.countryCode);
      }
    });
  }

  sendWhatsAppWelcomeMessage(): any {
    this.whatsAppService.sendWelcomeMessage(this.signUp.countryCode, this.signUp.phone).subscribe((data:any) => {
      console.log(data);
    },
      (error) => {                                     // on error
        console.log(error);
      });
  }

  test(_headers: any): any {
    this.testListService.saveToken({},_headers).subscribe((data:any) => {
      console.log(data);
      // this.router.navigate(['dashboard'])
      this.openAccountConfirmDialog();
    },
      (error) => {                                     // on error
        console.log(error);
      });
  }

  // verifyOtp(formValue: any, countryCode: string): void {
  //   this.signUpService.validateOtp(countryCode,this.signupForm.value.phone,formValue).subscribe((data) => {
  //     // this.toastr.success(data.message);
  //     if(data.statuscode === 200){
  //       console.log('JWT token',data);
  //       localStorage.setItem('token', data.accessToken)
  //       localStorage.setItem('tenant', data.tenantName);
  //       this.openAccountConfirmDialog();
  //     }
  //   },
  //     (error) => {                                     // on error
  //       // this.toastr.warning(error.error.message)
  //       // alert(error.error.message);
  //       this.openOTPVerificationPopup();
  //     });

  // }

  openSetUpAccountDialog() {
    this.router.navigate(['setup-account']);
    // const config: MatDialogConfig = {
    //   width: '450px',
    //   data: { message: 'Set Up Your Account', message2: `Please setup your account by entering your email ID and setting a password` }
    // };
    // const dialogRef = this.dialog.open(SetupAccountComponent, config);
    // dialogRef.afterClosed().subscribe((value) => {
    //   if (value) {
    //   }
    // });
  }

  onConfirmClick(): void {
    if (this.signupForm.value) {
      this.dialogRef.close(this.signupForm.value);
    } else {
    }
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  openAccountConfirmDialog() {
    const config: MatDialogConfig = {
      width: '487px',
      height: '292px',
      data: { message: 'Account Created, Congratulations!', message2: `You have successfully created an account with Infinity Learn.Happy Learning :) ` }
    };
    const dialogRef = this.dialog.open(AccountConfirmDialogComponent, config);
  }

  keyEscape(event: any) {
    // console.log(event)
    if(event.key === 'Escape') {
      this.dialogRef.close();
    }

    if(event.keyCode === 13) {
      document.getElementById('RegisterAndVerify')?.focus()
    }
  }

  closeDialogue() {
    this.dialogRef.close();
  }

  editMobileNumber() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      // width: '487px',
      // height: '226px',
      data: { message: 'Hey, ready to get started?' }
    };
    const dialogRef = this.dialog.open(LogindialogComponent, config);
  }

  openTermsAndConditionsDialog(): void {
    const config: MatDialogConfig = {
      // width: '557px',
      width: '500px',
      height: '90vh',
      panelClass: 'terms-condition-modalbox',
      data: { message: 'Terms of Use' }
    };
    const dialogRef = this.dialog.open(TermsAndConditionsDialogComponent, config);
  }
}
