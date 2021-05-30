import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/modules/shared/module/material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogindialogComponent } from './components/logindialog/logindialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupdialogComponent } from './components/signupdialog/signupdialog.component';
import { OtpverificationdialogComponent } from './components/otpverificationdialog/otpverificationdialog.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { GradesdialogComponent } from './components/gradesdialog/gradesdialog.component';

import { PasswordLoginDialogComponent } from './components/password-login-dialog/password-login-dialog.component';
import { ForgotPasswordDialogComponent } from './components/forgot-password-dialog/forgot-password-dialog.component';
import { OtpLoginDialogComponent } from './components/otp-login-dialog/otp-login-dialog.component';
import { VerifyOtpDialogComponent } from './components/verify-otp-dialog/verify-otp-dialog.component';
import { SetnewPasswordDialogComponent } from './components/setnew-password-dialog/setnew-password-dialog.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { SetupAccountComponent } from './components/setup-account/setup-account.component';
import { CommonMobileNumberComponent } from './components/common-mobile-number/common-mobile-number.component';
import { BoardsDialogComponent } from './components/boards-dialog/boards-dialog.component';
import { ExamDialogComponent } from './components/exam-dialog/exam-dialog.component';
import { FilterpipePipe } from './pipes/filterpipe.pipe';
import { CountdownModule } from 'ngx-countdown';
import { CountdownComponentComponent } from './components/countdown-component/countdown-component.component';
import { AccountConfirmDialogComponent } from './components/account-confirm-dialog/account-confirm-dialog.component';
import { TermsAndConditionsDialogComponent } from './components/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDeleteImageDialogComponent } from './components/confirm-delete-image-dialog/confirm-delete-image-dialog.component';
import { EditPhoneNumberDialogComponent } from './components/edit-phone-number-dialog/edit-phone-number-dialog.component';
import { ConfirmEditPhoneNumberDialogComponent } from './components/confirm-edit-phone-number-dialog/confirm-edit-phone-number-dialog.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { VerifyEmailDialogComponent } from './components/verify-email-dialog/verify-email-dialog.component';
import { ChangePasswordViaOtpDialogComponent } from './components/change-password-via-otp-dialog/change-password-via-otp-dialog.component';
import { VerifyOtpViaChangePasswordDialogComponent } from './components/verify-otp-via-change-password-dialog/verify-otp-via-change-password-dialog.component';
import { MathModule } from './directives/math/math.module';
import { SafePipe } from './pipes/SafePipe';

@NgModule({
  declarations: [LogindialogComponent,
     PasswordLoginDialogComponent,
      ForgotPasswordDialogComponent,
       OtpLoginDialogComponent,
        VerifyOtpDialogComponent, 
        SetnewPasswordDialogComponent,
        OtpverificationdialogComponent,
        GradesdialogComponent,
        SignupdialogComponent,
        SetupAccountComponent,
        CommonMobileNumberComponent,
        BoardsDialogComponent,
        ExamDialogComponent,
        FilterpipePipe,
        SafePipe,
        CountdownComponentComponent,
        AccountConfirmDialogComponent,
        TermsAndConditionsDialogComponent,
        ConfirmDialogComponent,
        ConfirmDeleteImageDialogComponent,
        EditPhoneNumberDialogComponent,
        ConfirmEditPhoneNumberDialogComponent,
        ChangePasswordDialogComponent,
        VerifyEmailDialogComponent,
        ChangePasswordViaOtpDialogComponent,
        VerifyOtpViaChangePasswordDialogComponent
        ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    NgxIntlTelInputModule,
    CountdownModule,
    MathModule
  ],
  exports: [
    MaterialModule,
    LogindialogComponent,
    OtpverificationdialogComponent,
    CommonMobileNumberComponent,
    MathModule,
    SafePipe
  ],
  entryComponents: [
    OtpverificationdialogComponent,
    LogindialogComponent,
    PasswordLoginDialogComponent,
    ForgotPasswordDialogComponent,
    OtpLoginDialogComponent,
    VerifyOtpDialogComponent,
    SetnewPasswordDialogComponent,
    BoardsDialogComponent,
    CommonMobileNumberComponent,
    AccountConfirmDialogComponent,
    TermsAndConditionsDialogComponent,
    ConfirmDialogComponent,
    EditPhoneNumberDialogComponent,
    ConfirmEditPhoneNumberDialogComponent,
    VerifyEmailDialogComponent
],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class SharedModule { }


