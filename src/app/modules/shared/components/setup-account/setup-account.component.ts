import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GradesdialogComponent } from '../gradesdialog/gradesdialog.component';
import { OtpverificationdialogComponent } from '../otpverificationdialog/otpverificationdialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-setup-account',
  templateUrl: './setup-account.component.html',
  styleUrls: ['./setup-account.component.css']
})

export class SetupAccountComponent implements OnInit {
  accountForm:any;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  // tslint:disable-next-line:variable-name
  constructor(private dialog: MatDialog,private _formBuilder:FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<SetupAccountComponent>,
              public router: Router) {
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    this.setupAccountForm();
  }

  setupAccountForm(): void {
    this.accountForm = this._formBuilder.group({
      email: [this.data.email || '', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: [this.data.password ||  '', [Validators.required, Validators.minLength(6)]],
      confirmpassword: [this.data.confirmpassword || '', [Validators.required, Validators.minLength(6)]]
    })
  }

  // setAccountForm(): void {
  //   this.accountForm = this._formBuilder.group({
  //     email: [this.email, [Validators.required]],
  //     password: [this.signUp.firstName, [Validators.required]],
  //     confirmpassword: [this.signUp.lastName, [Validators.required]]
  //   });
  //   this.accountForm.markAllAsTouched()
  // }

  get a() { return this.accountForm.controls; }

  passwordLogin() {
    console.log(this.accountForm.value)
    this.accountForm.markAllAsTouched()
    if(this.accountForm.valid && this.accountForm.value.email.length!==0 &&
      this.accountForm.value.password.length!==0 &&
      this.accountForm.value.confirmpassword!==0 &&
      this.accountForm.value.password === this.accountForm.value.confirmpassword) {
        console.log(this.accountForm)
        this.dialogRef.close();
          const config: MatDialogConfig = {
              width: '570px',
              height: '450px',
              data: {
              message:'Great, your account is almost ready',
              message2: 'Help us with your academic details, so we can curate content specially for you',
              // message3: 'What grade are you in',
              accountDetails: this.accountForm.value}
          };
      const dialogRef = this.dialog.open(GradesdialogComponent, config);
     }
  }

  showPassword(): void {
    this.show_button = !this.show_button;
  }

  showConfirmPassword(): void {
    this.show_eye = !this.show_eye;
  }

  isPasswordEqualToConfirmPassword(): boolean {
    if(this.accountForm.value.password === this.accountForm.value.confirmpassword){
      return true
    }
     else return false;
  }

  setupLater() {
    this.dialogRef.close();
    //this.router.navigate(['dashboard']);

    const config: MatDialogConfig = {
        width: '570px',
        height: '454px',
        data: {
        message:'Great, your account is almost ready',
        message2: 'Help us with your academic details, so we can curate content specially for you',
        // message3: 'What grade are you in',
        accountDetails: this.accountForm.value}
    };
    const dialogRef = this.dialog.open(GradesdialogComponent, config);
  }
}
