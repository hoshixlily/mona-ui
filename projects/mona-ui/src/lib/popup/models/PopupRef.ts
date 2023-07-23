import { asapScheduler, Observable } from "rxjs";
import { PopupCloseEvent } from "./PopupCloseEvent";
import { ComponentRef } from "@angular/core";
import { OverlayRef } from "@angular/cdk/overlay";
import { PopupRefParams } from "./PopupRefParams";

export class PopupRef {
    #options: PopupRefParams;

    public constructor(options: PopupRefParams) {
        this.#options = options;
    }

    public close<R>(result?: R): void {
        this.#options.close(result);
    }

    /**
     * Closes the popup after a delay.
     * When popup is closed, the overlay element is removed from the DOM instantly.
     * This causes the animation of the child elements to not play, therefore
     * a delay is added to allow the animation to play.
     *
     * @see {@link https://github.com/angular/angular/issues/23302} for more information.
     * @param delay delay in milliseconds
     * @param result optional result to pass to the closed observable
     */
    public closeWithDelay<R>(delay: number, result?: R): void {
        asapScheduler.schedule(() => this.close(result), delay);
    }

    public get closed(): Observable<PopupCloseEvent> {
        return this.#options.closed$;
    }

    public get component(): ComponentRef<any> | null {
        return this.#options.component;
    }

    public get overlayRef(): OverlayRef {
        return this.#options.overlayRef;
    }
}
