import { PopupRef } from "../../../popup/models/PopupRef";

export class PopoverShownEvent {
    public constructor(public readonly target: Element, public readonly popupRef: PopupRef) {}
}
