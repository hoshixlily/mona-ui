import { MenuItem } from "./MenuItem";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { Subject } from "rxjs";

export interface ContextMenuInjectorData {
    isRoot?: boolean;
    menuClick?: Subject<MenuItem>;
    menuItems: MenuItem[];
    parentMenuRef?: PopupRef;
    popupClass?: string | string[];
    subMenuClose?: Subject<void>;
    viaKeyboard?: boolean;
}
