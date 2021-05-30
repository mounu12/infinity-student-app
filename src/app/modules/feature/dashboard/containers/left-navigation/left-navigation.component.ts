import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '@app-services/user/user.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {

  // @Input() userObject: any;
  user: any;
  userId: any;
  userData: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // console.log(this.userObject)
    this.user = this.userService.getUser();
    this.userId = this.user.personalDetails.userId
    this.loadUser();
  }

  loadUser(): void {
    this.userService.loadUserDetails(this.userId).subscribe((data) => {
      this.userData = data;
    });
  }

}
