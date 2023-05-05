import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy } from "@angular/core";
import { Column } from "../models/Column";
import * as i0 from "@angular/core";
export declare class GridColumnResizeHandlerDirective implements AfterViewInit, OnDestroy {
    private readonly elementRef;
    private readonly zone;
    private readonly cdr;
    private readonly destroy$;
    column: Column;
    resizeEnd: EventEmitter<void>;
    resizeStart: EventEmitter<void>;
    constructor(elementRef: ElementRef<HTMLDivElement>, zone: NgZone, cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private onMouseDown;
    private setEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridColumnResizeHandlerDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GridColumnResizeHandlerDirective, "[monaGridColumnResizeHandler]", never, { "column": { "alias": "column"; "required": false; }; }, { "resizeEnd": "resizeEnd"; "resizeStart": "resizeStart"; }, never, never, false, never>;
}
