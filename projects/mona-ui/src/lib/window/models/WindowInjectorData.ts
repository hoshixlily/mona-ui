import { ElementRef, TemplateRef, Type } from "@angular/core";
import { PopupRef } from "../../popup/models/PopupRef";

export interface WindowInjectorData {
    content: TemplateRef<unknown> | Type<unknown>;
    draggable: boolean;
    focusedElement?: HTMLElement | ElementRef<HTMLElement> | string;
    height?: number;
    maxHeight: number;
    maxWidth: number;
    minHeight: number;
    minWidth: number;
    popupRef: PopupRef;
    resizable: boolean;
    title?: string;
    titleTemplate?: TemplateRef<unknown>;
    width?: number;
}
