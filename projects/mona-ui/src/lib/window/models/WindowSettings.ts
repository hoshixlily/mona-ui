import { TemplateRef, Type } from "@angular/core";

export interface WindowSettings {
    content: TemplateRef<unknown> | Type<unknown>;
    height?: number;
    minHeight?: number;
    minWidth?: number;
    width?: number;
}
