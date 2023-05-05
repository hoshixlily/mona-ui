import { EventEmitter, OnInit } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class ColorPaletteComponent implements OnInit, ControlValueAccessor {
    private propagateChange;
    colors: string[];
    selectedColor: string | null;
    columns: number;
    set palette(palette: Iterable<string>);
    tileSize: number;
    set value(value: string | null);
    get value(): string | null;
    valueChange: EventEmitter<string | null>;
    constructor();
    ngOnInit(): void;
    onColorSelect(color: string): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    writeValue(obj: string | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPaletteComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorPaletteComponent, "mona-color-palette", never, { "columns": { "alias": "columns"; "required": false; }; "palette": { "alias": "palette"; "required": false; }; "tileSize": { "alias": "tileSize"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, false, never>;
}
