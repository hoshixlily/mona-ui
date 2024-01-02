import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DropDownService {
    public constructor() {}

    public static getDefaultPositions(): ConnectionPositionPair[] {
        return [
            new ConnectionPositionPair(
                { originX: "start", originY: "bottom" },
                { overlayX: "start", overlayY: "top" },
                -1,
                0,
                "mona-dropdown-popup-content-bottom"
            ),
            new ConnectionPositionPair(
                { originX: "start", originY: "top" },
                { overlayX: "start", overlayY: "bottom" },
                -1,
                -1,
                "mona-dropdown-popup-content-top"
            )
        ];
    }

    public focusPopup(popupClass: string): void {
        const popupElement = document.querySelector(`.${popupClass} ul`);
        if (popupElement) {
            (popupElement as HTMLElement).focus();
        }
    }
}
