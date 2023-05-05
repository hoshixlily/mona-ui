import { OnInit, TemplateRef } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class SwitchComponent implements OnInit, ControlValueAccessor {
    private propagateChange;
    active: boolean;
    labelOff: string;
    labelOn: string;
    offLabelTemplate: TemplateRef<never> | null;
    onLabelTemplate: TemplateRef<never> | null;
    constructor();
    ngOnInit(): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    toggle(event: Event): void;
    writeValue(obj: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwitchComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SwitchComponent, "mona-switch", never, { "labelOff": { "alias": "labelOff"; "required": false; }; "labelOn": { "alias": "labelOn"; "required": false; }; }, {}, ["offLabelTemplate", "onLabelTemplate"], never, false, never>;
}
