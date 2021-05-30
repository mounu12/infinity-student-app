import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupService } from '@app-services/signup/signup.service';
import { SignupdialogComponent } from 'src/app/modules/shared/components/signupdialog/signupdialog.component';
import { OtpLoginDialogComponent } from 'src/app/modules/shared/components/otp-login-dialog/otp-login-dialog.component';
import { TermsAndConditionsDialogComponent } from '@app-shared/components/terms-and-conditions-dialog/terms-and-conditions-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // data ={
  //   mobile : null,
  //   countryCode: '+91'
  // }
  searchValue: any = '';
  err: any;
  constructor(
    private dialog: MatDialog,
    public signUpService: SignupService,
  ) { }

  ngOnInit(): void {
  }

  doSearch(value: string): void {
    this.searchValue = value;
  }

  errorMessage(value: any): void {
    this.err = value;
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  signup() {
    this.clearLocalStorage();
    this.signUpService.verifyPhoneNumber(this.searchValue).subscribe((data) => {
      if(data.existingUser === false){
       this.openSignUpDialog();
      } else if(data.existingUser === true){
        this.openOTPLoginDialog();
       }
    },
      (error) => {                                     // on error
        // this.errorMessage = error.error.message
      });
  }

  openSignUpDialog(): void {
    const config: MatDialogConfig = {
      // width: '450px',
      width: '500px',
      data: {message: `Seems like you're a new user`, 
             message2: 'Please enter your name to register', 
             phone: this.searchValue.number, 
             countryCode: this.searchValue.dialCode }
    };
    const dialogRef = this.dialog.open(SignupdialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        // this.revokeTokenObject(user_detail._id);
      }
    });
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

  openOTPLoginDialog() {
    // const config: MatDialogConfig = {
    //   data: { message: 'Hey, ready to get started?',
    //           phone: this.searchValue.number
    //  }
    // };
    // const dialogRef = this.dialog.open(LogindialogComponent, config);

    const config: MatDialogConfig = {
      width: '439px',
      data: { message: 'Password Login', message2: 'Please enter your registered phone number and password to get started', 
              phone: this.searchValue.number, countryCode: this.searchValue.dialCode }
    };
    const dialogRef = this.dialog.open(OtpLoginDialogComponent, config);


  }

  enterKey(event : any) : void {
    // console.log(this.searchValue.number.length)
    if (event.keyCode == 13 && event.target.value.length===10) {
        this.signup();
    }
}

  escapeKey(event: any) {
      event.target.value = '';
    }
  // revokeTokenObject(id): void {
  //   const userId = id;    
  //   this.userService.revokeToken(userId).subscribe((data) => {
  //     this.toastr.success(data.message);
  //   },
  //     (error) => {                                     // on error
  //       this.toastr.warning(error.error.message)
  //     });
  // }

  }
