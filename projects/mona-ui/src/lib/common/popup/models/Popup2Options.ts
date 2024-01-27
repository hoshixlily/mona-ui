import { TemplateRef } from "@angular/core";

export interface Popup2Options {
    anchor: HTMLElement;
    content: TemplateRef<any>;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
}
