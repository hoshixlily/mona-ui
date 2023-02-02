import { PopupRef } from "../../../../popup/models/PopupRef";

export interface ContextMenuCloseEvent {
    popupRef?: PopupRef;
    uid: string;
}
