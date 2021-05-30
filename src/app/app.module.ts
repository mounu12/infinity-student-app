import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/core/components/home/home.component';
import { HeaderComponent } from './modules/core/components/header/header.component';
import { LoginComponent } from './modules/core/components/login/login.component';
import { ProductsComponent } from './modules/core/components/products/products.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './modules/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { SharedModule } from './modules/shared/shared.module';
import { AssesmentComponent } from '@app-modules/feature/products/assesment/assesment.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { LoggedInHeaderComponent } from '@app-core/components/logged-in-header/logged-in-header.component';
import { MathModule } from '@app-shared/directives/math/math.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    ProductsComponent,
    AssesmentComponent,
    LoggedInHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    NgxWebstorageModule.forRoot(),
    MathModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
