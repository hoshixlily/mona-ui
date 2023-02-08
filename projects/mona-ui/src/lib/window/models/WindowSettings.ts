import { ElementRef, TemplateRef, Type } from "@angular/core";

export interface WindowSettings {
    content: TemplateRef<unknown> | Type<unknown>;
    draggable?: boolean;
    focusedElement?: HTMLElement | ElementRef<HTMLElement> | string;
    height?: number;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    modal?: boolean;
    resizable?: boolean;
    title?: string | TemplateRef<unknown>;
    width?: number;
}
