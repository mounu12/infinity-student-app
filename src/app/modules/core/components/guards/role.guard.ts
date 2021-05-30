import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '@app-core/components/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  roles = [];
  userDetail: any;

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.loadRoles();
    let expectedRoleArray = route.data.roles;
    // console.log('assigned role to route', expectedRoleArray)
    // console.log(this.roles.some(r => expectedRoleArray.includes(r)))
    if (this.roles.some(r => expectedRoleArray.includes(r))) {
      // console.log("User permitted to access the route");
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

  loadRoles(): void {
    // this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    const value = this.userDetail.userType
    this.roles = []
    for (let i = 0; i < value.length; i++) {
      const element = value[i].role;
      // this.roles.push(element);
    }
    // console.log('roles', this.roles);
  }

}
