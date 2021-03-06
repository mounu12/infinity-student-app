import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent  } from './editprofile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: EditProfileComponent },
  // { path: 'create-arc-user', pathMatch: 'full', component: CreateArchivedUserComponent },
  // { path: 'create-arc-user/:id', pathMatch: 'full', component: CreateArchivedUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProfileRoutingModule { }
