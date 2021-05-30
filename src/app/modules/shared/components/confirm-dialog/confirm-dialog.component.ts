import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit(): void {
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
