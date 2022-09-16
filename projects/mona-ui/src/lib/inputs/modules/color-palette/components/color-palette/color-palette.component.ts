import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { Dictionary, KeyValuePair } from "@mirei/ts-collections";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";

@Component({
    selector: "mona-color-palette",
    templateUrl: "./color-palette.component.html",
    styleUrls: ["./color-palette.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPaletteComponent),
            multi: true
        }
    ]
})
export class ColorPaletteComponent implements OnInit, ControlValueAccessor {
    private propagateChange: Action<string | null> | null = null;
    public colorMap: Dictionary<number, string> = new Dictionary<number, string>();
    public selectedColor: KeyValuePair<number, string> | null = null;

    @Input()
    public columns: number = 8;

    @Input()
    public set palette(palette: Iterable<string>) {
        this.colorMap.clear();
        let i = 0;
        for (const color of palette) {
            this.colorMap.add(i, color);
            i++;
        }
    }

    @Input()
    public tileSize: number = 24;

    @Input()
    public set value(value: string | null) {
        if (value) {
            this.selectedColor = this.colorMap.firstOrDefault(x => x.value === value);
        } else {
            this.selectedColor = null;
        }
    }

    @Output()
    public valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

    public constructor() {}

    public ngOnInit(): void {}

    public onColorSelect(color: KeyValuePair<number, string>): void {
        if (this.selectedColor?.key === color.key) {
            this.selectedColor = null;
            this.propagateChange?.(null);
            this.valueChange.emit(null);
            return;
        }
        this.selectedColor = color;
        this.valueChange.emit(color.value);
        this.propagateChange?.(color.value);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: string | null): void {
        this.selectedColor = this.colorMap.firstOrDefault(x => x.value === obj);
    }
}
