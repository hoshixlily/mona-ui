import { Observable } from "rxjs";
import { WindowCloseEvent } from "./WindowCloseEvent";
import { ComponentRef } from "@angular/core";
import { MoveEvent } from "./MoveEvent";
import { PopupRef } from "../../popup/models/PopupRef";
import { ResizeEvent } from "./ResizeEvent";

/**
 * @internal
 */

export interface WindowRefParams<R = unknown> {
    close: (result?: R) => void;
    center: () => void;
    move: (params: { top?: number; left?: number }) => void;
    resize: (params: { width?: number; hight?: number; center?: boolean }) => void;

    get beforeClose$(): Observable<WindowCloseEvent>;

    get close$(): Observable<WindowCloseEvent>;

    get component(): ComponentRef<any> | null;

    get element(): HTMLElement;

    get drag$(): Observable<MoveEvent>;

    get dragEnd$(): Observable<void>;

    get dragStart$(): Observable<void>;

    get popupRef(): PopupRef;

    get resize$(): Observable<ResizeEvent>;
}
