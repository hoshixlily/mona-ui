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

    public get beforeClose$(): Observable<WindowCloseEvent> {
        return this.#options.beforeClose$;
    }

    public get close$(): Observable<WindowCloseEvent> {
        return this.#options.close$;
    }

    public get component(): ComponentRef<any> | null {
        return this.#options.component;
    }

    public get drag$(): Observable<MoveEvent> {
        return this.#options.drag$;
    }

    public get dragEnd$(): Observable<void> {
        return this.#options.dragEnd$;
    }

    public get dragStart$(): Observable<void> {
        return this.#options.dragStart$;
    }

    public get element(): HTMLElement {
        return this.#options.element;
    }

    public get popupRef(): PopupRef {
        return this.#options.popupRef;
    }

    public get resize$(): Observable<ResizeEvent> {
        return this.#options.resize$;
    }
}
