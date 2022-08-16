import { NgModule } from "@angular/core";
import { RadioButtonDirective } from "./directives/radio-button.directive";

@NgModule({
    declarations: [RadioButtonDirective],
    exports: [RadioButtonDirective]
})
export class RadioButtonModule {}
