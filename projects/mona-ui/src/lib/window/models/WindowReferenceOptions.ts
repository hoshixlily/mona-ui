import { PopupRef } from "../../popup/models/PopupRef";
import { ComponentRef } from "@angular/core";

export interface WindowReferenceOptions {
    componentRef?: ComponentRef<any>; // Type of componentRef is ComponentRef<WindowContentComponent>. It is set as any to avoid circular dependency.
    popupRef: PopupRef;
}
