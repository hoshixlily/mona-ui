import { TemplateRef } from "@angular/core";
import { PopupConnectPosition } from "./PopupConnectPosition";

export interface Popup2Options {
    anchor: HTMLElement;
    content: TemplateRef<any>;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    positions?: PopupConnectPosition[];
    push?: boolean;
    width?: number;
}
