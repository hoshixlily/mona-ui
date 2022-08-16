import { NgModule } from "@angular/core";
import { TextAreaDirective } from "./directives/text-area.directive";

@NgModule({
    declarations: [TextAreaDirective],
    exports: [TextAreaDirective]
})
export class TextAreaModule {}
