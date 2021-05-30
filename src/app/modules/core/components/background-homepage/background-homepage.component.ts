import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SetupAccountComponent } from '@app-shared/components/setup-account/setup-account.component';

@Component({
  selector: 'app-background-homepage',
  templateUrl: './background-homepage.component.html',
  styleUrls: ['./background-homepage.component.css']
})
export class BackgroundHomepageComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
       const config: MatDialogConfig = {
      width: '570px',
      height: '500px',
      data: { message: 'Set Up Your Account ', message2: `Please setup your account by entering your email ID and setting a password` }
    };
    const dialogRef = this.dialog.open(SetupAccountComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
      }
    });
  }

}
