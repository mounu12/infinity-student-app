import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '@app-services/user/user.service';
import { VerifyEmailDialogComponent } from '@app-shared/components/verify-email-dialog/verify-email-dialog.component';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyProfileComponent implements OnInit {
  user:any;
  userId: any;
  constructor(private userService: UserService, public router: Router,
    private dialog: MatDialog,
    ) {
    // this.userId = this.userService.getUser().userId
   }

  ngOnInit(): void {
    // this.user = this.userService.getUser();
    const user = this.userService.getUser();
    console.log(user)
    this.userId = user.personalDetails.userId
    this.loadUser();
  }

  loadUser(): void {
    this.userService.loadUserDetails(this.userId).subscribe((data) => {
      // console.log(typeof(data));
      this.user = data;
    });
  }

  showMyProfile() : void {
    this.router.navigate(['myprofile']);
  }

  showMyDashboard() : void {
    this.router.navigate(['dashboard']);
  }

  showEditProfile() : void {
    // const user = event.selected;
    // const { _id } = user;
    this.router.navigate(['myprofile/editProfile', this.userId])
  }

  verifyEmail(): void {
    const config: MatDialogConfig = {
      width: '487px',
      height: '292px',
      data: { message: 'Verification Mail Sent', message2: `We’ve mailed you a link to verify your email. Check your inbox` }
    };
    const dialogRef = this.dialog.open(VerifyEmailDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value === true) {
        console.log('v', value)
        // call api to do
        // this.verifyEmail()
        this.router.navigate(['myprofile'])
      }
    });
  }

  logout() : void {
    this.userService.emptyUser();
    localStorage.clear()
    this.router.navigate([''])
  }

  formatPhoneNumber(phone: any): any {
    const phoneNumber = phone?.toString().slice(0, 4) + ' ' + phone?.toString().slice(4,7) + ' ' + phone?.toString().slice(7,10)
    return phoneNumber
  }
}
