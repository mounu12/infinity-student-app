import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssesmentComponent } from './assesment/assesment.component';
// import { MockTestComponent } from './mock-test/mock-test.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'assesments', pathMatch: 'full', component: AssesmentComponent },
    // {path: 'about', pathMatch:'full', component:MockTestComponent}

];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
