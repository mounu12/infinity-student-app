import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { SharedModule } from '@app-shared/shared.module';
import { LeftNavigationComponent } from './containers/left-navigation/left-navigation.component';
import { MyReportsComponent } from './containers/dashboard/my-reports/my-reports.component';
import { InfoBoxComponent } from './containers/dashboard/info-box/info-box.component';
import { TestReportsComponent } from './containers/test-reports/test-reports.component';
import { ExamPageComponent } from './containers/exam-page/exam-page.component';
import { QuestionComponent } from './containers/exam-page/question/question.component';
import { AnswerSheetComponent } from './containers/exam-page/answer-sheet/answer-sheet.component';
import { SolutionAnswerSheetComponent } from './containers/exam-page/solution-answer-sheet/solution-answer-sheet.component';
import { TestListComponent } from './containers/test-list/test-list.component';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { InstructionsComponent } from './containers/exam-page/instructions/instructions.component';
import { FormsModule } from "@angular/forms";
import { BeginWalkthroughComponent } from './containers/exam-page/begin-walkthrough/begin-walkthrough.component';
import { ViewTestReportComponent } from './containers/view-test-report/view-test-report.component';
import { LocalStorageService } from 'ngx-webstorage';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SubmitConfirmationComponent } from './containers/exam-page/submit-confirmation/submit-confirmation.component';
import { SubmitReviewComponent } from './containers/exam-page/submit-review/submit-review.component';
import { DonutChartComponent } from './containers/graphs/donut-chart/donut-chart.component';
import { BarChartComponent } from './containers/graphs/bar-chart/bar-chart.component';
import { SolutionPageComponent } from './containers/solution-page/solution-page.component';
import { SolutionComponent } from './containers/solution-page/solution/solution.component';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChartsModule } from 'ng2-charts';
import { ViewDetailedReportComponent } from './containers/test-reports/view-detailed-report/view-detailed-report.component';
import { MathModule } from '@app-shared/directives/math/math.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [DashboardComponent, LeftNavigationComponent, MyReportsComponent, InfoBoxComponent, TestReportsComponent, ExamPageComponent, QuestionComponent, AnswerSheetComponent, SolutionAnswerSheetComponent, TestListComponent, InstructionsComponent, BeginWalkthroughComponent, ViewTestReportComponent, SubmitConfirmationComponent, SubmitReviewComponent,
    DonutChartComponent, BarChartComponent, SolutionPageComponent, SolutionComponent, ViewDetailedReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    FormsModule,
    ChartsModule,
    MathModule,
    NgxSpinnerModule
  ],
  providers: [
    DashboardService,
    NzNotificationService
  ],
  exports:[
    LeftNavigationComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }
