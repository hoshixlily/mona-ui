import { Injectable } from "@angular/core";
import { PopupService } from "../../../../popup/services/popup.service";
import { ContextMenuSettings } from "../models/ContextMenuSettings";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { ConnectedPosition } from "@angular/cdk/overlay";

@Injectable({
    providedIn: "root"
})
export class ContextMenuService {
    public currentContextMenuContentId: string = "";
    public readonly defaultSubMenuPositions: ConnectedPosition[] = [
        {
            originX: "end",
            originY: "top",
            overlayX: "start",
            overlayY: "top"
        },
        {
            originX: "start",
            originY: "top",
            overlayX: "end",
            overlayY: "top"
        },
        {
            originX: "end",
            originY: "bottom",
            overlayX: "start",
            overlayY: "bottom"
        },
        {
            originX: "start",
            originY: "bottom",
            overlayX: "end",
            overlayY: "bottom"
        }
    ];

    public constructor(public readonly popupService: PopupService) {}

    public open(settings: ContextMenuSettings): PopupRef {
        const popupRef = this.popupService.create({
            ...settings,
            hasBackdrop: false
        });
        return popupRef;
    }
}
