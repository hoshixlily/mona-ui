import {
    Component,
    computed,
    forwardRef,
    Host,
    Input,
    OnChanges,
    OnInit,
    signal,
    Signal,
    SimpleChange,
    SimpleChanges,
    WritableSignal
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { PaletteType } from "../../models/PaletteType";
import { ColorService } from "../../../../services/color.service";
import { ColorScheme } from "../../../../models/ColorScheme";

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
    ]
})
export class ColorPaletteComponent implements OnInit, OnChanges, ControlValueAccessor {
    private propagateChange: Action<string | null> | null = null;
    public colorScheme: WritableSignal<ColorScheme> = signal<ColorScheme>(ColorService.FlatColorScheme);
    public paletteColumns: Signal<number> = signal<number>(10);
    public selectedColor: string | null = null;

    @Input()
    public columns: number = 10;

    @Input()
    public palette: PaletteType | Iterable<string> = [];

    @Input()
    public tileSize: number = 18;

    public constructor(@Host() private readonly colorService: ColorService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        const paletteChange = changes["palette"];
        this.handlePaletteChange(paletteChange);
    }

    public ngOnInit(): void {
        this.paletteColumns = computed(() => {
            const scheme = this.colorScheme();
            return scheme.columns;
        });
    }

    public onColorSelect(color: string): void {
        if (this.selectedColor === color) {
            this.selectedColor = null;
            this.propagateChange?.(null);
            return;
        }
        this.selectedColor = color;
        this.propagateChange?.(color);
    }

    private handlePaletteChange(paletteChange: SimpleChange): void {
        if (paletteChange) {
            if (typeof paletteChange.currentValue !== "string") {
                this.colorScheme.set({
                    colors: [...paletteChange.currentValue],
                    columns: this.columns,
                    name: "custom"
                });
            } else {
                this.colorScheme.set(this.colorService.getColorScheme(paletteChange.currentValue as PaletteType));
            }
        }
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: string | null): void {
        this.selectedColor = this.colorScheme().colors.find(c => c === obj) ?? null;
    }
}
