import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardsService } from '@app-services/boarrds/boards.service';
import { ExamDialogComponent } from '../exam-dialog/exam-dialog.component';
import { GradesdialogComponent } from '../gradesdialog/gradesdialog.component';

@Component({
  selector: 'app-boards-dialog',
  templateUrl: './boards-dialog.component.html',
  styleUrls: ['./boards-dialog.component.css']
})
export class BoardsDialogComponent implements OnInit {
  boardForm: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  searchText = '';
  boards:any = [];
  searchIndices: any = [];
  allSearchIndices: any = [];
  boards1: any;
  index: any;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<BoardsDialogComponent>,
    private dialog: MatDialog, private boardsServices: BoardsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = !this.data.isBoardEdit;
  }

  ngOnInit(): void {
    console.log('dialog data', this.data);
    this.getBoards();
    this.createBoardsForm();
    if (this.data.boardsData) {
      this.createBoardsForm();
      this.boards1 = this.data.boardsData;
      this.setGradesForm();
    }
  }

  getBoards(): any {
    this.boardsServices.getBoardsList().subscribe((data: any) => {
      this.boards = data;
      for(let i =0, len = data.length; i < len; i++ ) {
        this.searchIndices.push(i);
      }
      this.allSearchIndices = this.searchIndices;
    });
  }

  createBoardsForm(): void {
    this.boardForm = this._formBuilder.group({
      boards: this._formBuilder.array([])
    });
  }

  setGradesForm(): void {
    this.boardForm = this._formBuilder.group({
      boardName: [this.boards.boardName],
      boardimage: [this.boards.boardimage],
      description: [this.boards.description],
      id: [this.boards.id]
    });
  }

  saveIndex(i: any) {
    this.index = i;
    this.data.boardsData.id = i+ 1;
  }

  onConfirmClick() {
    this.dialogRef.close();
    if (this.data.boardsData) {
      this.dialogRef.close(this.boards[this.index]);
    }
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  selectBoard(i: any) {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '570px',
      height: '626px  ',
      data: {
        message: 'What exams are you targetting?', message2: `Select as many. If you can’t find it in the list, enter in the search box`,
        accountDetails: this.data.accountDetails, gradesDetails: this.data.gradesDetails,
        boardsDetails: this.boards[i]
      }
    };
    const dialogRef = this.dialog.open(ExamDialogComponent, config);
  }

  searchBoards(event: KeyboardEvent) { // with type info
    const searchString = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if(searchString == "") {
      this.searchIndices = this.allSearchIndices
    } else {
      const res: any = [];
      const boards = this.boards;
      for(let i = 0, len = boards.length; i < len; i++) {
        if(boards[i].boardName.toLowerCase().indexOf(searchString) >  -1 || boards[i].description.toLowerCase().indexOf(searchString) > -1) {
          res.push(i);
        }
      }
      this.searchIndices = res;
    }
  }
  showPrevStep() {
    this.dialogRef.close();
    const config: MatDialogConfig = {
      width: '570px',
      height: '450px',
      data: {
        message:'Great, your account is almost ready',
        message2: 'Help us with your academic details, so we can curate content specially for you',
        accountDetails: this.data.accountDetails
      }
    };
    const dialogRef = this.dialog.open(GradesdialogComponent, config);
  }
}
