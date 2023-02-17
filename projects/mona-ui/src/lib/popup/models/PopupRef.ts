import { Observable, of, Subject } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";
import { PopupCloseEvent } from "./PopupCloseEvent";

export class PopupRef {
    private closed$: Subject<PopupCloseEvent> = new Subject<PopupCloseEvent>();

    public constructor(public readonly overlayRef: OverlayRef) {}

    public close<R>(result?: R): void {
        this.overlayRef.dispose();
        this.closed$.next(new PopupCloseEvent({ result, via: "programmatic" }));
        this.closed$.complete();
    }

    public get closed(): Observable<PopupCloseEvent> {
        return this.closed$.asObservable();
    }
}
