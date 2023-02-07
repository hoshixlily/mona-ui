import { PopupRef } from "../../popup/models/PopupRef";
import { Observable } from "rxjs";

export class WindowRef {
    private readonly element: HTMLElement;
    private readonly popupRef: PopupRef;
    public constructor(popupRef: PopupRef) {
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

    public close<T = unknown>(result?: T): void {
        this.popupRef.close(result);
    }

    public get closed(): Observable<unknown> {
        return this.popupRef.closed;
    }
}
