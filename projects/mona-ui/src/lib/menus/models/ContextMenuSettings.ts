import { ConnectedPosition } from "@angular/cdk/overlay";
import { PopupSettings } from "../../popup/models/PopupSettings";

export interface ContextMenuSettings extends Omit<PopupSettings, "hasBackdrop"> {}

export const defaultSubMenuPositions: ConnectedPosition[] = [
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
