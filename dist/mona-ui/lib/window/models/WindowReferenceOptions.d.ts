import { PopupRef } from "../../popup/models/PopupRef";
import { ComponentRef } from "@angular/core";
export interface WindowReferenceOptions {
    componentRef?: ComponentRef<any>;
    popupRef: PopupRef;
}
