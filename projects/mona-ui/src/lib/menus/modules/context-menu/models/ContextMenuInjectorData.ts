import { MenuItem } from "./MenuItem";
import { InjectionToken } from "@angular/core";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { Observable, Subject } from "rxjs";

export const ContextMenuInjectionToken = new InjectionToken<ContextMenuInjectorData>("ContextMenuInjectorData");

export interface ContextMenuInjectorData {
    menuClick?: Subject<MenuItem>;
    menuItems: MenuItem[];
    parentClose?: Observable<unknown>;
}
