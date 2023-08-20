import { PreventableEvent } from "../../utils/PreventableEvent";
import { ToolbarAction } from "./ToolbarOptions";

export class ListBoxActionClickEvent<T = any> extends PreventableEvent {
    readonly #action: ToolbarAction;
    readonly #selectedItem: T | null;
    public constructor(action: ToolbarAction, selectedItem: T | null) {
        super("listBoxActionClick");
        this.#action = action;
        this.#selectedItem = selectedItem;
    }

    public get action(): ToolbarAction {
        return this.#action;
    }

    public get selectedItem(): T | null {
        return this.#selectedItem;
    }
}
