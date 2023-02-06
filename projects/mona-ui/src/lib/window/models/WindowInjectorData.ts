import { TemplateRef, Type } from "@angular/core";
import { PopupRef } from "../../popup/models/PopupRef";

export interface WindowInjectorData {
    content: TemplateRef<unknown> | Type<unknown>;
    popupRef: PopupRef;
    title?: string;
}
