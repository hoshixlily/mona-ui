import { InjectionToken } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ContextMenuItem } from "./ContextMenuItem";
import { PopupRef } from "../../../../popup/models/PopupRef";

export const ContextMenuInjectionToken = new InjectionToken<ContextMenuInjectorData>("ContextMenuInjectorData");

export interface ContextMenuInjectorData {
    menuClick?: Subject<ContextMenuItem>;
    menuItems: ContextMenuItem[];
    parentClose?: Observable<unknown>;
    parentId?: string;
    submenuClose?: Subject<string>;
    submenuPopupRef?: PopupRef;
    viaKeyboard?: boolean;
}
