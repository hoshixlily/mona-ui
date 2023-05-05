import { PopupCloseEvent, PopupCloseEventOptions } from "../../popup/models/PopupCloseEvent";
export declare class WindowCloseEvent<R = unknown> extends PopupCloseEvent<R> {
    constructor(options?: Partial<WindowCloseEventOptions<R>>);
}
export interface WindowCloseEventOptions<R = unknown> extends PopupCloseEventOptions<R> {
}
