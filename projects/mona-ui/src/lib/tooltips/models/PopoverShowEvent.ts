import { PreventableEvent } from "../../utils/PreventableEvent";

export class PopoverShowEvent extends PreventableEvent {
    public constructor(public readonly target: Element) {
        super("popoverShow");
    }
}
