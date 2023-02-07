import { TemplateRef, Type } from "@angular/core";

export interface WindowSettings {
    content: TemplateRef<unknown> | Type<unknown>;
    draggable?: boolean;
    height?: number;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    modal?: boolean;
    resizable?: boolean;
    width?: number;
}
