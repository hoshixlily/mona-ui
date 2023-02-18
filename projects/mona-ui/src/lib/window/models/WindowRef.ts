import { asapScheduler, map, Observable, Subject } from "rxjs";
import { ResizeEvent } from "./ResizeEvent";
import { PopupRef } from "../../popup/models/PopupRef";
import { MoveEvent } from "./MoveEvent";
import { WindowCloseEvent } from "./WindowCloseEvent";
import { PopupCloseSource } from "../../popup/models/PopupCloseEvent";

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

    public get moved$(): Observable<MoveEvent> {
        return this.#options.moved$;
    }

    public get resized$(): Observable<ResizeEvent> {
        return this.#options.resized$;
    }
}

/**
 * @internal
 */
interface WindowRefParams<R = unknown> {
    close: (result?: R) => void;
    center: () => void;
    move: (params: { top?: number; left?: number }) => void;
    resize: (params: { width?: number; hight?: number; center?: boolean }) => void;
    get closed$(): Observable<WindowCloseEvent>;
    get moved$(): Observable<MoveEvent>;
    get popupRef(): PopupRef;
    get resized$(): Observable<ResizeEvent>;
}

/**
 * @internal - used by WindowService. Do not export.
 */
export class WindowReference<R = unknown> implements WindowRefParams<R> {
    public readonly element: HTMLElement;
    public readonly popupReference: PopupRef;
    public readonly move$: Subject<MoveEvent> = new Subject<MoveEvent>();
    public readonly resize$: Subject<ResizeEvent> = new Subject<ResizeEvent>();

    public constructor(popupRef: PopupRef) {
        this.popupReference = popupRef;
        this.element = popupRef.overlayRef.overlayElement;
    }

    public center(): void {
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }

    public close(result?: R): void {
        const event =
            result instanceof WindowCloseEvent
                ? result
                : new WindowCloseEvent({ result, via: PopupCloseSource.Programmatic });
        this.popupReference.close(event);
    }

    public move(params: { top?: number; left?: number }): void {
        if (params.top) {
            this.element.style.top = `${params.top}px`;
        }
        if (params.left) {
            this.element.style.left = `${params.left}px`;
        }
    }

    public resize(params: { width?: number; height?: number; center?: boolean }): void {
        if (params.width) {
            this.element.style.width = `${params.width}px`;
        }
        if (params.height) {
            this.element.style.height = `${params.height}px`;
        }
        if (params.center) {
            asapScheduler.schedule(() => this.center());
        }
    }

    public get closed$(): Observable<WindowCloseEvent> {
        return this.popupReference.closed.pipe(
            map(event => {
                if (event.type === "windowClose") {
                    return event;
                }
                return new WindowCloseEvent({ event, via: event.via, type: "windowClose", result: event.result });
            })
        );
    }

    public get moved$(): Observable<MoveEvent> {
        return this.move$;
    }

    public get popupRef(): PopupRef {
        return this.popupReference;
    }

    public get resized$(): Observable<ResizeEvent> {
        return this.resize$;
    }

    public get windowRef(): WindowRef<R> {
        return new WindowRef<R>(this);
    }
}
