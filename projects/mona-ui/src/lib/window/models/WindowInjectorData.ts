import { ElementRef, TemplateRef, Type } from "@angular/core";
import { WindowReference } from "./WindowRef";

export interface WindowInjectorData {
    content: TemplateRef<unknown> | Type<unknown>;
    draggable: boolean;
    focusedElement?: HTMLElement | ElementRef<HTMLElement> | string;
    height?: number;
    maxHeight: number;
    maxWidth: number;
    minHeight: number;
    minWidth: number;
    resizable: boolean;
    title?: string;
    titleTemplate?: TemplateRef<unknown>;
    width?: number;
    windowReference: WindowReference;
}
