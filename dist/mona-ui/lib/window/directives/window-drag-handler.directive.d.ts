import { AfterViewInit, ElementRef, NgZone, OnDestroy } from "@angular/core";
import { WindowReference } from "../models/WindowReference";
import * as i0 from "@angular/core";
export declare class WindowDragHandlerDirective implements AfterViewInit, OnDestroy {
    private readonly elementRef;
    private readonly zone;
    private readonly componentDestroy$;
    draggable?: boolean;
    windowRef: WindowReference;
    constructor(elementRef: ElementRef<HTMLElement>, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onMouseDown(event: MouseEvent): void;
    private setEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowDragHandlerDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WindowDragHandlerDirective, "div[monaWindowDragHandler]", never, { "draggable": { "alias": "draggable"; "required": false; }; "windowRef": { "alias": "windowRef"; "required": false; }; }, {}, never, never, false, never>;
}
