import { MenuItem } from "./MenuItem";
import { InjectionToken } from "@angular/core";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { Observable } from "rxjs";

export const ContextMenuInjectionToken = new InjectionToken<ContextMenuInjectorData>("ContextMenuInjectorData");

export interface ContextMenuInjectorData {
    menuItems: MenuItem[];
    parentClose?: Observable<unknown>;
}
