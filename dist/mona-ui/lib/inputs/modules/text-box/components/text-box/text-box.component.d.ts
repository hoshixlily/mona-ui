import { ElementRef, EventEmitter, OnInit, QueryList, TemplateRef } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class TextBoxComponent implements OnInit, ControlValueAccessor {
    readonly elementRef: ElementRef<HTMLDivElement>;
    private propagateChange;
    value: string;
    disabled: boolean;
    inputBlur: EventEmitter<Event>;
    inputFocus: EventEmitter<Event>;
    prefixTemplateList: QueryList<TemplateRef<any>>;
    readonly: boolean;
    suffixTemplateList: QueryList<TemplateRef<any>>;
    constructor(elementRef: ElementRef<HTMLDivElement>);
    ngOnInit(): void;
    onValueChange(value: string): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    writeValue(obj: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextBoxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextBoxComponent, "mona-text-box", never, { "disabled": { "alias": "disabled"; "required": false; }; "readonly": { "alias": "readonly"; "required": false; }; }, { "inputBlur": "inputBlur"; "inputFocus": "inputFocus"; }, ["prefixTemplateList", "suffixTemplateList"], never, false, never>;
}
