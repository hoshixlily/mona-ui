import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipComponent } from "./components/tooltip/tooltip.component";

@NgModule({
    declarations: [TooltipComponent],
    imports: [CommonModule],
    exports: [TooltipComponent]
})
export class TooltipModule {}
