import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopoverComponent } from "./components/popover/popover.component";
import { PopoverFooterTemplateDirective } from "./directives/popover-footer-template.directive";

@NgModule({
    declarations: [PopoverComponent, PopoverFooterTemplateDirective],
    imports: [CommonModule],
    exports: [PopoverComponent, PopoverFooterTemplateDirective]
})
export class PopoverModule {}
