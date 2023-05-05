import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnInit, Renderer2 } from "@angular/core";
import { AbstractSliderComponent } from "../abstract-slider/abstract-slider.component";
import { Action } from "../../../../../utils/Action";
import * as i0 from "@angular/core";
export declare class RangeSliderComponent extends AbstractSliderComponent implements OnInit {
    protected readonly elementRef: ElementRef<HTMLElement>;
    protected readonly renderer: Renderer2;
    protected readonly cdr: ChangeDetectorRef;
    protected readonly zone: NgZone;
    protected propagateChange: Action<any> | null;
    ranged: boolean;
    value: [number, number] | null;
    valueChange: EventEmitter<[number, number]>;
    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2, cdr: ChangeDetectorRef, zone: NgZone);
    ngOnInit(): void;
    protected emitValues(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RangeSliderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RangeSliderComponent, "mona-range-slider", never, { "value": { "alias": "value"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
