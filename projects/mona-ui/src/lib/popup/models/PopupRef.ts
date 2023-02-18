import { Observable } from "rxjs";
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
