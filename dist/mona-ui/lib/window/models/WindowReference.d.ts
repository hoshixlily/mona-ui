import { Observable, Subject } from "rxjs";
import { MoveEvent } from "./MoveEvent";
import { ResizeEvent } from "./ResizeEvent";
import { PopupRef } from "../../popup/models/PopupRef";
import { WindowCloseEvent } from "./WindowCloseEvent";
import { ComponentRef } from "@angular/core";
import { WindowRef } from "./WindowRef";
import { WindowRefParams } from "./WindowRefParams";
import { WindowReferenceOptions } from "./WindowReferenceOptions";
/**
 * @internal - used by WindowService. Do not export.
 */
export declare class WindowReference<R = unknown> implements WindowRefParams<R> {
    private readonly options;
    readonly move$: Subject<MoveEvent>;
    readonly resize$: Subject<ResizeEvent>;
    constructor(options: WindowReferenceOptions);
    center(): void;
    close(result?: R): void;
    move(params: {
        top?: number;
        left?: number;
    }): void;
    resize(params: {
        width?: number;
        height?: number;
        center?: boolean;
    }): void;
    get closed$(): Observable<WindowCloseEvent>;
    get component(): ComponentRef<any> | null;
    get element(): HTMLElement;
    get moved$(): Observable<MoveEvent>;
    get popupRef(): PopupRef;
    get resized$(): Observable<ResizeEvent>;
    get windowRef(): WindowRef<R>;
}
