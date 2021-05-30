import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-delete-image-dialog',
  templateUrl: './confirm-delete-image-dialog.component.html',
  styleUrls: ['./confirm-delete-image-dialog.component.css']
})
export class ConfirmDeleteImageDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private dialog: MatDialog,
               private dialogRef: MatDialogRef<ConfirmDeleteImageDialogComponent>,
               public router: Router) { }

  ngOnInit(): void {
    // this.dialogRef.disableClose = true;
  }

  /**
   * To close all previously opened dialouges
   * @memberof ConfirmDialogComponent
   */
  onNoClick(): void {
    this.dialogRef.close('close');
  }

  /**
   * To close the dialog and confirm the cost file
   *
   * @memberof ConfirmDialogComponent
   */
  onConfirmClick(): void {
    const confirmStatus = true;
    this.dialogRef.close(confirmStatus);
  }

}
