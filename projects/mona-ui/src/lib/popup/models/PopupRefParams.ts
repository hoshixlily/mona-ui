import { Observable } from "rxjs";
import { PopupCloseEvent } from "./PopupCloseEvent";
import { ComponentRef } from "@angular/core";
import { OverlayRef } from "@angular/cdk/overlay";

/**
 * @internal
 */
export interface PopupRefParams {
    close: <R>(result?: R) => void;

    get closed$(): Observable<PopupCloseEvent>;

    get component(): ComponentRef<any> | null;

    get overlayRef(): OverlayRef;
}
