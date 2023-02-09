import { Observable, of, Subject } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";

export class PopupRef<R = unknown> {
    private closed$: Subject<R | undefined> = new Subject<R | undefined>();

    public constructor(public readonly overlayRef: OverlayRef) {}

    public close(result?: R): void {
        this.overlayRef.dispose();
        this.closed$.next(result);
        this.closed$.complete();
    }

    public get closed(): Observable<R | null> {
        return (this.closed$.asObservable() as Observable<R>) ?? of(null);
    }
}
