import { PreventableEvent } from "../../utils/PreventableEvent";

export class PopupCloseEvent<R = unknown> extends PreventableEvent {
    #options?: Partial<PopupCloseEventOptions<R>>;
    public constructor(options?: Partial<PopupCloseEventOptions<R>>) {
        super("close", options?.event);
        this.#options = options;
    }

    public get result(): R | undefined {
        return this.#options?.result;
    }

    public get via(): PopupCloseSource | undefined {
        return this.#options?.via;
    }
}

interface PopupCloseEventOptions<R = unknown> {
    event?: Event;
    result?: R;
    via?: PopupCloseSource;
}

export type PopupCloseSource = "backdropClick" | "escape" | "close" | "programmatic" | "outsideClick";
