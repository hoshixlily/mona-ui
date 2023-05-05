import { Observable } from "rxjs";
import { ResizeEvent } from "./ResizeEvent";
import { PopupRef } from "../../popup/models/PopupRef";
import { MoveEvent } from "./MoveEvent";
import { WindowCloseEvent } from "./WindowCloseEvent";
import { ComponentRef } from "@angular/core";
import { WindowRefParams } from "./WindowRefParams";
export declare class WindowRef<R = unknown> {
    #private;
    constructor(options: WindowRefParams<R>);
    close(result?: R): void;
    center(): void;
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
}
