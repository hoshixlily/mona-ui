import { NgClass } from "@angular/common";
import { Component, computed, forwardRef, Host, input, signal, Signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../utils/Action";
import { ColorScheme } from "../models/ColorScheme";
import { PaletteType } from "../models/PaletteType";
import { ColorService } from "../services/color.service";

@Component({
    selector: "mona-color-palette",
    templateUrl: "./color-palette.component.html",
    styleUrls: ["./color-palette.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPaletteComponent),
            multi: true
        },
        ColorService
    ],
    standalone: true,
    imports: [NgClass],
    host: {
        "[class.mona-color-palette]": "true",
        "[style.grid-template-columns]": "'repeat('+colorScheme().columns+', minmax('+tileSize()+'px, 1fr))'",
        "[style.grid-auto-rows]": "tileSize()+'px'"
    }
})
export class ColorPaletteComponent implements ControlValueAccessor {
    private propagateChange: Action<string | null> | null = null;
    protected readonly colorScheme: Signal<ColorScheme> = computed(() => {
        const palette = this.palette();
        const columns = this.columns();
        if (typeof palette === "string") {
            return this.colorService.getColorScheme(palette as PaletteType);
        } else {
            const paletteArray = Array.from(palette);
            if (paletteArray.length === 0) {
                return ColorService.FlatColorScheme;
            }
        }
        return {
            colors: [...palette],
            columns,
            name: "custom"
        };
    });
    protected readonly selectedColor = signal<string | null>(null);

    public columns = input(10);
    public palette = input<PaletteType | Iterable<string>>([]);
    public tileSize = input(18);

    public constructor(@Host() private readonly colorService: ColorService) {}

    public onColorSelect(color: string): void {
        if (this.selectedColor() === color) {
            this.selectedColor.set(null);
            this.propagateChange?.(null);
            return;
        }
        this.selectedColor.set(color);
        this.propagateChange?.(color);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: string | null): void {
        const color = this.colorScheme().colors.find(c => c === obj) ?? null;
        this.selectedColor.set(color);
    }
}
