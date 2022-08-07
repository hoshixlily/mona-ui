import { Directive, ViewContainerRef } from "@angular/core";
import { PopupService } from "../services/popup.service";

@Directive({
    selector: "[monaPopupAnchor]"
})
export class PopupAnchorDirective {
    public constructor(public readonly viewContainerRef: ViewContainerRef) {
        PopupService.popupAnchorDirective = this;
    }
}
