import { AfterViewInit, OnInit } from "@angular/core";
import { Action } from "../../../../../utils/Action";
import { CircularProgressBarLabelTemplateDirective } from "../../directives/circular-progress-bar-label-template.directive";
import * as i0 from "@angular/core";
export declare class CircularProgressBarComponent implements OnInit, AfterViewInit {
    circumference: number;
    color: string | Action<number, string>;
    disabled: boolean;
    indeterminate: boolean;
    labelTemplateDirective: CircularProgressBarLabelTemplateDirective | null;
    max: number;
    min: number;
    progress: number;
    size: number;
    thickness: number;
    set value(value: number);
    constructor();
    ngAfterViewInit(): void;
    ngOnInit(): void;
    private updateProgress;
    get sizePx(): string;
    get strokeColor(): string;
    get strokeDashOffset(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<CircularProgressBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CircularProgressBarComponent, "mona-circular-progress-bar", never, { "color": { "alias": "color"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "indeterminate": { "alias": "indeterminate"; "required": false; }; "max": { "alias": "max"; "required": false; }; "min": { "alias": "min"; "required": false; }; "progress": { "alias": "progress"; "required": false; }; "size": { "alias": "size"; "required": false; }; "thickness": { "alias": "thickness"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, ["labelTemplateDirective"], never, false, never>;
}
