import { ConnectedPosition } from "@angular/cdk/overlay";
import { Injectable } from "@angular/core";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { ContextMenuSettings } from "../models/ContextMenuSettings";

@Injectable({
    providedIn: "root"
})
export class ContextMenuService {
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
        return this.popupService.create({
            ...settings,
            hasBackdrop: false
        });
    }
}
