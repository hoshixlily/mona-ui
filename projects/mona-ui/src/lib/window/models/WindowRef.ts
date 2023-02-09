import { asapScheduler, Observable, Subject } from "rxjs";
import { ResizeEvent } from "./ResizeEvent";
import { PopupRef } from "../../popup/models/PopupRef";

export abstract class WindowRef<R = unknown> {
    public abstract close(result?: R): void;
    public abstract center(): void;
    public abstract resize(params: { width?: number; height?: number; center?: boolean }): void;
    public abstract get closed$(): Observable<R | null>;
    public abstract get resized$(): Observable<ResizeEvent>;
}

export class WindowReference<R = unknown> extends WindowRef<R> {
    public readonly element: HTMLElement;
    public readonly popupRef: PopupRef<R>;
    public readonly resize$: Subject<ResizeEvent> = new Subject<ResizeEvent>();

    public constructor(popupRef: PopupRef<R>) {
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
        this.popupRef.close(result);
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

    public get closed$(): Observable<R | null> {
        return this.popupRef.closed;
    }

    public get resized$(): Observable<ResizeEvent> {
        return this.resize$;
    }

    public get windowRef(): WindowRef<R> {
        return this;
    }
}
