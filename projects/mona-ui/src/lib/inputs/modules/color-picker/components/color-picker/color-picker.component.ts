import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";

@Component({
    selector: "mona-color-picker",
    templateUrl: "./color-picker.component.html",
    styleUrls: ["./color-picker.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true
        }
    ]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
    private propagateChange: Action<string | null> | null = null;
    public readonly noColorIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public color: string | null = null;

    @Input()
    public palette: string[] = [];

    @Output()
    public valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

    public constructor() {}

    public ngOnInit(): void {}

    public onColorPaletteValueChange(value: string | null): void {
        this.color = value;
        this.propagateChange?.(value);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: string | null): void {
        this.color = obj;
    }
}
