import { PreventableEvent } from "../../utils/PreventableEvent";
export declare class PopupCloseEvent<R = unknown> extends PreventableEvent {
    protected readonly options?: Partial<PopupCloseEventOptions<R>>;
    constructor(options?: Partial<PopupCloseEventOptions<R>>);
    get result(): R | undefined;
    get via(): PopupCloseSource | undefined;
}
export interface PopupCloseEventOptions<R = unknown> {
    event?: unknown;
    result?: R;
    type?: string;
    via?: PopupCloseSource;
}
export declare enum PopupCloseSource {
    BackdropClick = "backdropClick",
    CloseButton = "closeButton",
    Escape = "escape",
    Programmatic = "programmatic",
    OutsideClick = "outsideClick"
}
