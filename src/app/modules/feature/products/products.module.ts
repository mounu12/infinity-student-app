import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssesmentComponent } from './assesment/assesment.component';
import { ProductRoutingModule } from './products-routing.module';
// import { MockTestComponent } from './mock-test/mock-test.component';
import { SharedModule } from '@app-shared/shared.module';



@NgModule({
  declarations: [AssesmentComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ProductsModule { }
