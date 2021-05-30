import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';
import { MaterialModule } from '../shared/module/material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthService } from './components/auth-service/auth.service';
import { AuthGuard } from './components/guards/auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from '@app-services/interceptor/auth-interceptor';
import { SignupService } from '@app-services/signup/signup.service';
import { HttpConfigInterceptor } from '@app-services/new-interceptor/new-interceptor';
import { HeaderComponent } from './components/header/header.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
// import { AuthInterceptor } from '@app-services/interceptor/auth-interceptor';



@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    CoreRoutingModule,
    HttpClientModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    // PwaUpdateService,
    AuthService,
    AuthGuard,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    JwtHelperService,
    // LoginService,
    SignupService,
    CookieService
  ],
  exports: [
    
  ]
})
export class CoreModule { }
