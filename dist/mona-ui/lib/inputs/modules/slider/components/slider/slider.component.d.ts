import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { Action } from "../../../../../utils/Action";
import { ControlValueAccessor } from "@angular/forms";
import { AbstractSliderComponent } from "../abstract-slider/abstract-slider.component";
import * as i0 from "@angular/core";
export declare class SliderComponent extends AbstractSliderComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
    protected readonly elementRef: ElementRef<HTMLElement>;
    protected readonly renderer: Renderer2;
    protected readonly cdr: ChangeDetectorRef;
    protected readonly zone: NgZone;
    protected propagateChange: Action<any> | null;
    ranged: boolean;
    value: number | null;
    valueChange: EventEmitter<number>;
    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2, cdr: ChangeDetectorRef, zone: NgZone);
    ngOnInit(): void;
    protected emitValues(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SliderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SliderComponent, "mona-slider", never, { "value": { "alias": "value"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
