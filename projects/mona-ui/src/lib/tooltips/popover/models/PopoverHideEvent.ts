import { PreventableEvent } from "../../../utils/PreventableEvent";
import { PopupRef } from "../../../popup/models/PopupRef";

export class PopoverHideEvent extends PreventableEvent {
    public constructor(public readonly target: Element, public readonly popupRef: PopupRef) {
        super("popoverHide");
    }
}
