import { TemplateRef } from "@angular/core";
import { PopupRef } from "../../popup/models/PopupRef";

export interface WindowInjectorData {
    content: TemplateRef<void>;
    popupRef: PopupRef;
    title?: string;
}
