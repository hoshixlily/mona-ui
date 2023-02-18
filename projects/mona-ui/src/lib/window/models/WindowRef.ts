import { Observable } from "rxjs";
import { ResizeEvent } from "./ResizeEvent";
import { PopupRef } from "../../popup/models/PopupRef";
import { MoveEvent } from "./MoveEvent";
import { WindowCloseEvent } from "./WindowCloseEvent";
import { ComponentRef } from "@angular/core";
import { WindowRefParams } from "./WindowRefParams";

export class WindowRef<R = unknown> {
    #options: WindowRefParams<R>;

    public constructor(options: WindowRefParams<R>) {
        this.#options = options;
    }

    public close(result?: R): void {
        this.#options.close(result);
    }

    public center(): void {
        this.#options.center();
    }

    public move(params: { top?: number; left?: number }): void {
        this.#options.move(params);
    }

    public resize(params: { width?: number; height?: number; center?: boolean }): void {
        this.#options.resize(params);
    }

    public get closed$(): Observable<WindowCloseEvent> {
        return this.#options.closed$;
    }

    public get component(): ComponentRef<any> | null {
        return this.#options.component;
    }

    public get element(): HTMLElement {
        return this.#options.element;
    }

    public get moved$(): Observable<MoveEvent> {
        return this.#options.moved$;
    }

    public get popupRef(): PopupRef {
        return this.#options.popupRef;
    }

    public get resized$(): Observable<ResizeEvent> {
        return this.#options.resized$;
    }
}
