import { PopupRef } from "../../popup/models/PopupRef";

export interface ContextMenuOpenEvent {
    popupRef?: PopupRef;
    uid: string;
}
