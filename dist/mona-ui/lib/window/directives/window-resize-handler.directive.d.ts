import { AfterViewInit, ElementRef, NgZone, OnDestroy } from "@angular/core";
import { WindowResizeHandlerDirection } from "../models/WindowResizeHandlerDirection";
import { WindowReference } from "../models/WindowReference";
import * as i0 from "@angular/core";
export declare class WindowResizeHandlerDirective implements AfterViewInit, OnDestroy {
    private readonly elementRef;
    private readonly zone;
    private readonly destroy$;
    direction: WindowResizeHandlerDirection;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    windowRef: WindowReference;
    constructor(elementRef: ElementRef<HTMLDivElement>, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onMouseDown(event: MouseEvent): void;
    private setEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowResizeHandlerDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WindowResizeHandlerDirective, "div[monaWindowResizeHandler]", never, { "direction": { "alias": "direction"; "required": false; }; "maxHeight": { "alias": "maxHeight"; "required": false; }; "maxWidth": { "alias": "maxWidth"; "required": false; }; "minHeight": { "alias": "minHeight"; "required": false; }; "minWidth": { "alias": "minWidth"; "required": false; }; "windowRef": { "alias": "windowRef"; "required": false; }; }, {}, never, never, false, never>;
}
