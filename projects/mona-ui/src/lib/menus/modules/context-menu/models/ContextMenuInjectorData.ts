import { MenuItem } from "./MenuItem";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { Subject } from "rxjs";
import { EventEmitter } from "@angular/core";
import { ContextMenuNavigationEvent } from "./ContextMenuNavigationEvent";

export interface ContextMenuInjectorData {
    isRoot?: boolean;
    menuClick?: Subject<MenuItem>;
    menuItems: MenuItem[];
    navigate: EventEmitter<ContextMenuNavigationEvent>;
    parentMenuRef?: PopupRef;
    popupClass?: string | string[];
    subMenuClose?: Subject<void>;
    viaKeyboard?: boolean;
}
