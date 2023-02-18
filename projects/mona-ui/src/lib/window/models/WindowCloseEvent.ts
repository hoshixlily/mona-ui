import { PopupCloseEvent, PopupCloseEventOptions } from "../../popup/models/PopupCloseEvent";

export class WindowCloseEvent<R = unknown> extends PopupCloseEvent<R> {
    public constructor(options?: Partial<WindowCloseEventOptions<R>>) {
        super({
            type: "windowClose",
            ...options
        });
    }
}

export interface WindowCloseEventOptions<R = unknown> extends PopupCloseEventOptions<R> {}
