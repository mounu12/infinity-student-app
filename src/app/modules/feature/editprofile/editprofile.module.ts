import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProfileRoutingModule } from './editprofile-routing.module';
import { EditProfileComponent } from './editprofile.component';
import { SharedModule } from '@app-shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '@app-core/components/header/header.component';


@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    EditProfileRoutingModule,ReactiveFormsModule,
     
  ],
  exports: [
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class EditProfileModule { }
