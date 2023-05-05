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
    move: (params: {
        top?: number;
        left?: number;
    }) => void;
    resize: (params: {
        width?: number;
        hight?: number;
        center?: boolean;
    }) => void;
    get closed$(): Observable<WindowCloseEvent>;
    get component(): ComponentRef<any> | null;
    get element(): HTMLElement;
    get moved$(): Observable<MoveEvent>;
    get popupRef(): PopupRef;
    get resized$(): Observable<ResizeEvent>;
}
