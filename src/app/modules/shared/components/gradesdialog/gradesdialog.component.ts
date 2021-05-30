import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BoardsService } from '@app-services/boarrds/boards.service';
import { BoardsDialogComponent } from '../boards-dialog/boards-dialog.component';
import { SetupAccountComponent } from '@app-shared/components/setup-account/setup-account.component';

@Component({
  selector: 'app-gradesdialog',
  templateUrl: './gradesdialog.component.html',
  styleUrls: ['./gradesdialog.component.css']
})
export class GradesdialogComponent implements OnInit {

  gradesForm: any;
  boards = false;
  isExamtarget = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  grades:any = [];
  grades1: any;
  index: any;
  isSelected: boolean = false;

  constructor(private dialogRef: MatDialogRef<GradesdialogComponent>,
    private dialog: MatDialog, private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private gradesService: BoardsService,
    public router: Router) {
      dialogRef.disableClose = !this.data.isGradeEdit;
  }

  ngOnInit(): void {
    console.log('dialog data', this.data);
    this.getGrades();
    this.createGradesForm();
    if (this.data.boardsData) {
      this.createGradesForm();
      this.grades1 = this.data.boardsData;
      this.setGradesForm();
    }
    this.grades1 = this.data.boardsData.id
  }

  getGrades() {
    this.gradesService.getGradesList().subscribe((data: any) => {
      console.log(data);
      this.grades = new Array(data.length);
      for(let i =0, len = data.length; i < len; i++) {
        this.grades[Number(data[i].id) - 1] = data[i];
      }
    });
  }

  createGradesForm(): void {
    this.gradesForm = this._formBuilder.group({
      grades: this._formBuilder.array([])
    });
  }

  setGradesForm(): void {
    this.gradesForm = this._formBuilder.group({
      description: [this.grades.description],
      gradeName: [this.grades.gradeName],
      id: [this.grades.id]
    });
  }

  saveIndex(i: any) {
    this.index = i
    this.data.boardsData.id = i + 1;
  }

  grade() {
    this.dialogRef.close();
    this.openboards(this.index);
  }

  onConfirmClick() {
    this.dialogRef.close();
    if (this.data.boardsData) {
      this.dialogRef.close(this.grades[this.index]);
    }
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  openboards(i: any) {
    const config: MatDialogConfig = {
      width: '570px',
      height: '536px',
      data: {
        message: 'What board are you enrolled in?', message2: `If you can’t find it in the list, enter in the search box`,
        accountDetails: this.data.accountDetails, gradesDetails: this.grades[i]
      }
    };
    const dialogRef = this.dialog.open(BoardsDialogComponent, config);
  }

  showStep1() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '570px',
      height: '480px',
      data: {
        message: 'Set Up Your Account', message2: `Please setup your account by entering your email ID and setting a password`,
        ...this.data.accountDetails
      }
    };
    const dialogRef = this.dialog.open(SetupAccountComponent, config);
  }

}
