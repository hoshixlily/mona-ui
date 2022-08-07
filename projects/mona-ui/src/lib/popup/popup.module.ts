import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupAnchorDirective } from "./directives/popup-anchor.directive";
import { OverlayModule } from "@angular/cdk/overlay";
import { PopupComponent } from "./components/popup/popup.component";

@NgModule({
    declarations: [PopupAnchorDirective, PopupComponent],
    imports: [CommonModule, OverlayModule],
    exports: [PopupComponent, PopupAnchorDirective]
})
export class PopupModule {}
