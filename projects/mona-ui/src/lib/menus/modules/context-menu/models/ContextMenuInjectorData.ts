import { MenuItem } from "./MenuItem";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { Subject } from "rxjs";

export interface ContextMenuInjectorData {
    menuClick?: Subject<MenuItem>;
    menuItems: MenuItem[];
    parentMenuRef?: PopupRef;
}
