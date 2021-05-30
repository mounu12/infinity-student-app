import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SignupdialogComponent } from '../signupdialog/signupdialog.component';

@Component({
  selector: 'app-terms-and-conditions-dialog',
  templateUrl: './terms-and-conditions-dialog.component.html',
  styleUrls: ['./terms-and-conditions-dialog.component.css']
})
export class TermsAndConditionsDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TermsAndConditionsDialogComponent>
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
  }

  keyEscape(event: any) {
    // console.log(event)
    if(event.key === 'Escape') {
      this.dialogRef.close();
    }

    if(event.keyCode === 13) {
      document.getElementById('AgreeTerms')?.focus()
    }
  }

  acceptTerms(): void {
    this.dialogRef.close();
  }

}
