import { Observable, Subject } from "rxjs";
import { PopupCloseEvent } from "./PopupCloseEvent";
import { ComponentRef } from "@angular/core";
import { OverlayRef } from "@angular/cdk/overlay";
import { PopupRef } from "./PopupRef";
import { PopupRefParams } from "./PopupRefParams";
/**
 * @internal - used by the popup service. Do not use directly or export.
 */
export declare class PopupReference implements PopupRefParams {
    readonly overlayReference: OverlayRef;
    readonly closed$: Subject<PopupCloseEvent>;
    componentRef?: ComponentRef<any>;
    constructor(overlayReference: OverlayRef);
    close<R>(result?: R): void;
    get closed(): Observable<PopupCloseEvent>;
    get component(): ComponentRef<any> | null;
    get overlayRef(): OverlayRef;
    get popupRef(): PopupRef;
}
