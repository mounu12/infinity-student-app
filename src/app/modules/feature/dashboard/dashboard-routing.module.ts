import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { BeginWalkthroughComponent } from './containers/exam-page/begin-walkthrough/begin-walkthrough.component';
import { ExamPageComponent } from './containers/exam-page/exam-page.component';
import { InstructionsComponent } from './containers/exam-page/instructions/instructions.component';
import { SolutionPageComponent } from './containers/solution-page/solution-page.component';
import { SolutionComponent } from './containers/solution-page/solution/solution.component';
import { TestListComponent } from './containers/test-list/test-list.component';
import { TestReportsComponent } from './containers/test-reports/test-reports.component';
import { ViewTestReportComponent } from './containers/view-test-report/view-test-report.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'testsreport', pathMatch: 'full', component: TestReportsComponent },
  { path: 'exampage', pathMatch: 'full', component: ExamPageComponent },
  { path: 'viewsolutionspage', pathMatch: 'full', component: SolutionPageComponent },
  { path: 'testlist', pathMatch: 'full', component: TestListComponent },
  { path: 'testinstructions', pathMatch: 'full', component: InstructionsComponent },
  { path: 'viewtestreport', pathMatch: 'full', component: ViewTestReportComponent },
  { path: 'beginwalkthrough', pathMatch: 'full', component: BeginWalkthroughComponent },
  // { path: 'create-arc-user', pathMatch: 'full', component: CreateArchivedUserComponent },
  // { path: 'create-arc-user/:id', pathMatch: 'full', component: CreateArchivedUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
