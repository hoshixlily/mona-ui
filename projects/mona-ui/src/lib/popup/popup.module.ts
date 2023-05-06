import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverlayModule } from "@angular/cdk/overlay";
import { PopupComponent } from "./components/popup/popup.component";
import { PopupWrapperComponent } from "./components/popup-wrapper/popup-wrapper.component";

@NgModule({
    declarations: [PopupComponent, PopupWrapperComponent],
    imports: [CommonModule, OverlayModule],
    exports: [PopupComponent]
})
export class PopupModule {}
