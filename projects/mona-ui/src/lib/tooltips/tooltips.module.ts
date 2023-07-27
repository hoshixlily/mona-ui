import { NgModule } from "@angular/core";
import { TooltipModule } from "./modules/tooltip/tooltip.module";
import { PopoverModule } from "./modules/popover/popover.module";

@NgModule({
    declarations: [],
    imports: [],
    exports: [PopoverModule, TooltipModule]
})
export class TooltipsModule {}
