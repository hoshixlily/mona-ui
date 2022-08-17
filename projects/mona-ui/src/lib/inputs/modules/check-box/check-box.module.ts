import { NgModule } from "@angular/core";
import { CheckBoxDirective } from "./directives/check-box.directive";

@NgModule({
    declarations: [CheckBoxDirective],
    exports: [CheckBoxDirective]
})
export class CheckBoxModule {}
