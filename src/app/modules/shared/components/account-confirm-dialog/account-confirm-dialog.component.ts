import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TestlistService } from '@app-services/test/testlist.service';

@Component({
  selector: 'app-account-confirm-dialog',
  templateUrl: './account-confirm-dialog.component.html',
  styleUrls: ['./account-confirm-dialog.component.css']
})
export class AccountConfirmDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private dialog: MatDialog,
               private dialogRef: MatDialogRef<AccountConfirmDialogComponent>,
               public router: Router,private testListService: TestlistService) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  navigateToDashboard(): void {
    this.dialogRef.close();
    //this.router.navigate(['dashboard']);
    let mobile_and_name: any = localStorage.getItem('mobile_and_name');
    let mobile_and_name_obj=JSON.parse(mobile_and_name);
    
    localStorage.setItem('studentid', mobile_and_name_obj.mobile);

    let _headers = {
      'accesstoken': localStorage.getItem('token'),
      'studentid':  `${mobile_and_name_obj.mobile}`,
      // 'methodtype': 'RULES'
    };
    
    this.test(_headers);
  }


  accountSetup() : void {
    this.dialogRef.close();
    this.router.navigate(['setup-account']);
  }


  test(_headers: any): any {
  this.testListService.saveToken({},_headers).subscribe((data:any) => {
    console.log(data);
    this.router.navigate(['dashboard'])
  },
    (error:any) => {                                     // on error
      console.log(error);
    });
  }




}
