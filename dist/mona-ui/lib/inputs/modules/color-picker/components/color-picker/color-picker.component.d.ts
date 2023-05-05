import { EventEmitter, OnInit } from "@angular/core";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ControlValueAccessor } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class ColorPickerComponent implements OnInit, ControlValueAccessor {
    private propagateChange;
    readonly noColorIcon: IconDefinition;
    readonly dropdownIcon: IconDefinition;
    color: string | null;
    palette: string[];
    set value(value: string | null);
    get value(): string | null;
    valueChange: EventEmitter<string | null>;
    constructor();
    ngOnInit(): void;
    onColorPaletteValueChange(value: string | null): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    writeValue(obj: string | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorPickerComponent, "mona-color-picker", never, { "palette": { "alias": "palette"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
