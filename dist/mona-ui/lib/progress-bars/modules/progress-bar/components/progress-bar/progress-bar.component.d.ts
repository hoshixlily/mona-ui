import { AfterViewInit, ChangeDetectorRef, ElementRef, OnInit } from "@angular/core";
import { LabelPosition } from "../../models/LabelPosition";
import { Action } from "../../../../../utils/Action";
import * as i0 from "@angular/core";
export declare class ProgressBarComponent implements OnInit, AfterViewInit {
    private readonly elementRef;
    private readonly cdr;
    progress: number;
    rightClip: number;
    color: string | Action<number, string>;
    disabled: boolean;
    indeterminate: boolean;
    labelFormat?: Action<number, string>;
    labelPosition: LabelPosition;
    labelStyles: Partial<Record<string, string | number>>;
    labelVisible: boolean;
    max: number;
    min: number;
    set value(value: number);
    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    private updateProgress;
    private updateProgressStyle;
    get label(): string;
    get progressColor(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProgressBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProgressBarComponent, "mona-progress-bar", never, { "color": { "alias": "color"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "indeterminate": { "alias": "indeterminate"; "required": false; }; "labelFormat": { "alias": "labelFormat"; "required": false; }; "labelPosition": { "alias": "labelPosition"; "required": false; }; "labelStyles": { "alias": "labelStyles"; "required": false; }; "labelVisible": { "alias": "labelVisible"; "required": false; }; "max": { "alias": "max"; "required": false; }; "min": { "alias": "min"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
