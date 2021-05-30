import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TermsAndConditionsDialogComponent } from '@app-shared/components/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { SignupdialogComponent } from 'src/app/modules/shared/components/signupdialog/signupdialog.component';

@Component({
  selector: 'app-assesment',
  templateUrl: './assesment.component.html',
  styleUrls: ['./assesment.component.css']
})
export class AssesmentComponent implements OnInit  {
  searchValue: any = '';

  constructor(private dialog: MatDialog,) { }

  ngOnInit(): void {
  }
  // signup() {
  //   const config: MatDialogConfig = {
  //     width: '450px',
  //     data: { message: 'please enter your name to register' }
  //   };
  //   const dialogRef = this.dialog.open(SignupdialogComponent, config);
  // }
  // doSearch(value: string): void {
  //   this.searchValue = value;
  // }


  doSearch(value: string): void {
    this.searchValue = value;
  }

  signup() {
    const config: MatDialogConfig = {
      width: '450px',
      data: {message: 'Seems like you`re a new user', message2: 'Please enter your name to register', phone: this.searchValue.number, countryCode: this.searchValue.dialCode }
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
}
