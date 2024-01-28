import { TemplateRef } from "@angular/core";
import { AnimationOptions } from "../../../animations/models/AnimationOptions";
import { PopupConnectPosition } from "./PopupConnectPosition";

export interface Popup2Options {
    anchor: HTMLElement;
    animate?: boolean | Omit<AnimationOptions, "element">;
    content: TemplateRef<any>;
    classList?: string[];
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    positions?: PopupConnectPosition[];
    push?: boolean;
    width?: number;
}
