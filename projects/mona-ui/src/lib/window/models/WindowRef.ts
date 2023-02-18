import { asapScheduler, map, Observable, Subject } from "rxjs";
import { ResizeEvent } from "./ResizeEvent";
import { PopupRef } from "../../popup/models/PopupRef";
import { MoveEvent } from "./MoveEvent";
import { WindowCloseEvent } from "./WindowCloseEvent";
import { PopupCloseEvent, PopupCloseSource } from "../../popup/models/PopupCloseEvent";

export abstract class WindowRef<R = unknown> {
    public abstract close(result?: R): void;
    public abstract center(): void;
    public abstract move(params: { top?: number; left?: number }): void;
    public abstract resize(params: { width?: number; height?: number; center?: boolean }): void;
    public abstract get closed$(): Observable<WindowCloseEvent>;
    public abstract get moved$(): Observable<MoveEvent>;
    public abstract get resized$(): Observable<ResizeEvent>;
}

export class WindowReference<R = unknown> extends WindowRef<R> {
    public readonly element: HTMLElement;
    public readonly popupRef: PopupRef;
    public readonly move$: Subject<MoveEvent> = new Subject<MoveEvent>();
    public readonly resize$: Subject<ResizeEvent> = new Subject<ResizeEvent>();

    public constructor(popupRef: PopupRef) {
        super();
        this.popupRef = popupRef;
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
        this.popupRef.close(event);
    }

    public override move(params: { top?: number; left?: number }): void {
        if (params.top) {
            this.element.style.top = `${params.top}px`;
        }
        if (params.left) {
            this.element.style.left = `${params.left}px`;
        }
    }

    public override resize(params: { width?: number; height?: number; center?: boolean }): void {
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
        return this.popupRef.closed.pipe(
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

    public get resized$(): Observable<ResizeEvent> {
        return this.resize$;
    }

    public get windowRef(): WindowRef<R> {
        return this;
    }
}
