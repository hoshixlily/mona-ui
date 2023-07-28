import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopoverComponent } from "./components/popover/popover.component";
import { PopoverFooterTemplateDirective } from "./directives/popover-footer-template.directive";
import { PopoverTitleTemplateDirective } from "./directives/popover-title-template.directive";

@NgModule({
    declarations: [PopoverComponent, PopoverFooterTemplateDirective, PopoverTitleTemplateDirective],
    imports: [CommonModule],
    exports: [PopoverComponent, PopoverFooterTemplateDirective, PopoverTitleTemplateDirective]
})
export class PopoverModule {}
