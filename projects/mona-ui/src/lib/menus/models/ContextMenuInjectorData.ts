import { MenuItem } from "./MenuItem";
import { PopupRef } from "../../popup/models/PopupRef";
import { Subject } from "rxjs";
import { EventEmitter, OutputEmitterRef } from "@angular/core";
import { ContextMenuNavigationEvent } from "./ContextMenuNavigationEvent";

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
