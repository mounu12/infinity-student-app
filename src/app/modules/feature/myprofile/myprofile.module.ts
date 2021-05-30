import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileRoutingModule } from './myprofile-routing.module';
import { MyProfileComponent } from './myprofile.component';
import { SharedModule } from '@app-shared/shared.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { LeftNavigationComponent } from '../dashboard/containers/left-navigation/left-navigation.component';


@NgModule({
  declarations: [MyProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    MyProfileRoutingModule,
    DashboardModule
  ],
  exports: [
    LeftNavigationComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class MyProfileModule { }
