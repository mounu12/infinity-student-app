import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterLinkWithHref } from '@angular/router';
import { HomeComponent } from './modules/core/components/home/home.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true,scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
