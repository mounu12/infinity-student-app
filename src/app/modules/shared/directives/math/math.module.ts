import { NgModule } from "@angular/core";
import { MathDirective } from "./math.derective";
import { MathService } from "./math.service";

@NgModule({
  declarations: [MathDirective],
  exports: [MathDirective],
  providers: [MathService]
})
export class MathModule {}
