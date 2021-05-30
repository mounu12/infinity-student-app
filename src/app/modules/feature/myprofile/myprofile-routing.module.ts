import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from '../editprofile/editprofile.component';
import { MyProfileComponent } from './myprofile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MyProfileComponent },
  { path: 'editProfile/:id', pathMatch: 'full', component: EditProfileComponent },
  // { path: 'create-arc-user/:id', pathMatch: 'full', component: CreateArchivedUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
