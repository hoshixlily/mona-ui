import { Observable, of, Subject } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";

export class PopupRef<T = void> {
    private closed$: Subject<T | undefined> = new Subject<T | undefined>();

    public constructor(private readonly overlayRef: OverlayRef) {}

    public close(result?: T): void {
        this.overlayRef.dispose();
        this.closed$.next(result);
        this.closed$.complete();
    }

    public get closed(): Observable<T | null> {
        return (this.closed$.asObservable() as Observable<T>) ?? of(null);
    }
}
