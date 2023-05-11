import { PreventableEvent } from "../../utils/PreventableEvent";

export class PopupCloseEvent<R = unknown> extends PreventableEvent {
    readonly #options?: Partial<PopupCloseEventOptions<R>>;
    public constructor(options?: Partial<PopupCloseEventOptions<R>>) {
        super(options?.type ?? "popupClose", options?.event);
        this.#options = options;
    }

    public get result(): R | undefined {
        return this.#options?.result;
    }

    public get via(): PopupCloseSource | undefined {
        return this.#options?.via;
    }
}

export interface PopupCloseEventOptions<R = unknown> {
    event?: unknown;
    result?: R;
    type?: string;
    via?: PopupCloseSource;
}

export enum PopupCloseSource {
    BackdropClick = "backdropClick",
    CloseButton = "closeButton",
    Escape = "escape",
    Programmatic = "programmatic",
    OutsideClick = "outsideClick"
}
