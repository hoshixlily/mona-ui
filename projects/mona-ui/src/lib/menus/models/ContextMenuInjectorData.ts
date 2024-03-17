import { OutputEmitterRef } from "@angular/core";
import { Subject } from "rxjs";
import { PopupRef } from "../../popup/models/PopupRef";
import { ContextMenuNavigationEvent } from "./ContextMenuNavigationEvent";
import { MenuItem } from "./MenuItem";

export interface ContextMenuInjectorData {
    isRoot?: boolean;
    menuClick?: Subject<MenuItem>;
    menuItems: Iterable<MenuItem>;
    navigate: OutputEmitterRef<ContextMenuNavigationEvent>;
    parentMenuRef?: PopupRef;
    popupClass?: string | string[];
    subMenuClose?: Subject<void>;
    viaKeyboard?: boolean;
}
