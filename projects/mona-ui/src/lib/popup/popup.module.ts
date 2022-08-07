import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupAnchorDirective } from "./directives/popup-anchor.directive";
import { OverlayModule } from "@angular/cdk/overlay";

@NgModule({
    declarations: [PopupAnchorDirective],
    imports: [CommonModule, OverlayModule],
    exports: [PopupAnchorDirective]
})
export class PopupModule {}
