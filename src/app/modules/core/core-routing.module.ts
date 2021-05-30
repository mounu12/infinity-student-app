import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssesmentComponent } from '@app-modules/feature/products/assesment/assesment.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { BackgroundHomepageComponent } from './components/background-homepage/background-homepage.component';
// import { MockTestComponent } from '@app-modules/feature/products/mock-test/mock-test.component';
import { AuthGuard } from './components/guards/auth.guard';
import { RoleGuard } from './components/guards/role.guard';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: HomeComponent
  },
  {
    path:'assesments', component:AssesmentComponent
  },
  {
    path:'setup-account', component:BackgroundHomepageComponent
  },
  {
    path: 'dashboard',
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('@app-modules/feature/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    // data: { 
    //     roles: ['SUPER_ADMIN','ADMIN']
    //   }
  },
  {
    path: 'myprofile',
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('@app-modules/feature/myprofile/myprofile.module').then(m => m.MyProfileModule),
    canActivate: [AuthGuard],
    // data: {
    //     roles: ['SUPER_ADMIN','ADMIN']
    //   }
  },
  {
    path: 'editProfile',
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('@app-modules/feature/editprofile/editprofile.module').then(m => m.EditProfileModule),
    canActivate: [AuthGuard],
    // data: {
    //     roles: ['SUPER_ADMIN','ADMIN']
    //   }
  },
  // {
  //   path:'about-us', component:AboutUsComponent
  // },
  {
    path: '**', redirectTo: ''
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
