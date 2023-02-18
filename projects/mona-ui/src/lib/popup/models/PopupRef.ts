import { Observable, Subject } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";
import { PopupCloseEvent, PopupCloseSource } from "./PopupCloseEvent";

export class PopupRef {
    private closed$: Subject<PopupCloseEvent> = new Subject<PopupCloseEvent>();

    public constructor(public readonly overlayRef: OverlayRef) {}

    public close<R>(result?: R): void {
        const event =
            result instanceof PopupCloseEvent
                ? result
                : new PopupCloseEvent({ result, via: PopupCloseSource.Programmatic });
        this.overlayRef.dispose();
        this.closed$.next(event);
        this.closed$.complete();
    }

    public get closed(): Observable<PopupCloseEvent> {
        return this.closed$.asObservable();
    }
}
