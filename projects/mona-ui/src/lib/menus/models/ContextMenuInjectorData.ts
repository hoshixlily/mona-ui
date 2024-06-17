import { OutputEmitterRef } from "@angular/core";
import { Subject } from "rxjs";
import { PopupRef } from "../../popup/models/PopupRef";
import { ContextMenuNavigationEvent } from "./ContextMenuNavigationEvent";
import { MenuItem } from "./MenuItem";

export interface ContextMenuInjectorData<C = any> {
    context?: C;
    isRoot?: boolean;
    menuClick?: Subject<InternalMenuItemClickEvent<C>>;
    menuItems: Iterable<MenuItem>;
    navigate: OutputEmitterRef<ContextMenuNavigationEvent>;
    parentMenuRef?: PopupRef;
    popupClass?: string | string[];
    subMenuClose?: Subject<void>;
    viaKeyboard?: boolean;
}

export interface InternalMenuItemClickEvent<C> {
    context?: C;
    originalEvent: MouseEvent | KeyboardEvent;
}

export interface MenuItemClickEvent<C, T> extends InternalMenuItemClickEvent<C> {
    data?: T;
}
