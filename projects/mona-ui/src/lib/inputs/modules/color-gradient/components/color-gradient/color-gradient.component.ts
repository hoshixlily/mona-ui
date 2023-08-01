import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    OnInit,
    Signal,
    signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { SliderComponent } from "../../../slider/components/slider/slider.component";
import { distinctUntilChanged, fromEvent, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faCopy, faSort, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { HSV, HSVSignal, RGBA, RGBSignal } from "../../models/ColorSpaces";
import { ColorMode } from "../../models/ColorMode";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
    selector: "mona-color-gradient",
    templateUrl: "./color-gradient.component.html",
    styleUrls: ["./color-gradient.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorGradientComponent),
            multi: true
        }
    ]
})
export class ColorGradientComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    readonly #clipboard: Clipboard = inject(Clipboard);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #pointerMouseDown: boolean = false;
    #pointerMouseMove: boolean = false;
    #propagateChange: (value: string) => void = () => {};
    public readonly copyIcon: IconDefinition = faCopy;
    public readonly switchIcon: IconDefinition = faSort;
    public readonly errorIcon: IconDefinition = faTimes;
    public readonly hueValue$: Subject<number> = new Subject<number>();
    public alpha: WritableSignal<number> = signal(255);
    public alphaInputColor: Signal<string> = signal("#FFFFFF");
    public colorMode: WritableSignal<ColorMode> = signal("rgb");
    public hex: Signal<string> = signal("#FFFFFF");
    public hexFocused: WritableSignal<boolean> = signal(false);
    public hexInputValue: WritableSignal<string> = signal("");
    public hsv: WritableSignal<HSVSignal> = signal<HSVSignal>({ h: signal(255), s: signal(255), v: signal(255) });
    public hsvRectBackground: Signal<string> = signal("");
    public hsvPointerLeft: number = 0;
    public hsvPointerTop: number = 0;
    public rgb: WritableSignal<RGBSignal> = signal<RGBSignal>({ r: signal(255), g: signal(255), b: signal(255) });
    public selectedColor: Signal<string> = signal("");

    @ViewChild("hueSliderElement")
    public hueSlider!: SliderComponent;

    @ViewChild("hsvPointer")
    public hsvPointer!: ElementRef<HTMLDivElement>;

    @ViewChild("hsvRectangle")
    public hsvRectangle!: ElementRef<HTMLDivElement>;

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit() {
        this.setSubscriptions();
    }

    public ngOnInit(): void {
        this.hsvRectBackground = computed(() => {
            const hsv = this.hsv();
            const rgb = this.hsv2rgb(hsv.h(), 100, 100);
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        });
        this.selectedColor = computed(() => {
            const rgb = this.rgb();
            return `rgba(${rgb.r()}, ${rgb.g()}, ${rgb.b()}, ${this.alpha() / 255})`;
        });
        this.hex = computed(() => {
            const rgb = this.rgb();
            const alpha = this.alpha();
            const focused = this.hexFocused();
            if (!focused) {
                return this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), alpha);
            }
            return this.hexInputValue();
        });

        /**
         * We need the color without alpha for the input color
         */
        this.alphaInputColor = computed(() => {
            const rgb = this.rgb();
            return this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), 255);
        });
    }

    public onAlphaChange(value: number): void {
        this.alpha.set(value);
        this.updateHexInputValue();
        this.#propagateChange(this.hex());
    }

    public onCopyColorSelect(mode: "hex" | "rgb"): void {
        switch (mode) {
            case "hex":
                this.#clipboard.copy(this.hex());
                break;
            case "rgb":
                const rgb = this.rgb();
                const alpha = Math.round((this.alpha() / 255) * 100) / 100;
                this.#clipboard.copy(`rgba(${rgb.r()}, ${rgb.g()}, ${rgb.b()}, ${alpha})`);
                break;
        }
    }

    public onRgbChange(value: number, channel: "r" | "g" | "b"): void {
        if (value == null) {
            return;
        }
        const rgb = this.rgb();
        rgb[channel].set(value);
        const hsv = this.rgb2hsv(rgb.r(), rgb.g(), rgb.b());
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
        this.updateHexInputValue();
        this.hsvPointerLeft = this.getPositionFromSaturation(hsv.s);
        this.hsvPointerTop = this.getPositionFromValue(hsv.v);
        this.#propagateChange(this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), this.alpha()));
    }

    public onHsvChange(value: number, channel: "h" | "s" | "v"): void {
        if (value == null) {
            return;
        }
        const hsv = this.hsv();
        hsv[channel].set(value);
        const rgb = this.hsv2rgb(hsv.h(), hsv.s(), hsv.v());
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.updateHexInputValue();
        this.hsvPointerLeft = this.getPositionFromSaturation(hsv.s());
        this.hsvPointerTop = this.getPositionFromValue(hsv.v());
        this.#propagateChange(this.rgba2hex(rgb.r, rgb.g, rgb.b, this.alpha()));
    }

    public onHexChange(value: string): void {
        this.hexInputValue.set(value);
        if (!this.isValidHex(value)) {
            console.warn("Invalid hex value");
            return;
        }
        const rgb = this.hex2rgba(value);
        const hsv = this.rgb2hsv(rgb.r, rgb.g, rgb.b);
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.alpha.set(rgb.a);
        this.hsvPointerLeft = this.getPositionFromSaturation(hsv.s);
        this.hsvPointerTop = this.getPositionFromValue(hsv.v);
        this.#propagateChange(value);
    }

    public onHexInputBlur(): void {
        this.updateHexInputValue();
    }

    public onHexInputFocus(): void {
        this.hexFocused.set(true);
    }

    public onSwitchColorModeClick(): void {
        this.colorMode.set(this.colorMode() === "rgb" ? "hsv" : "rgb");
    }

    public registerOnChange(fn: any) {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any) {}

    public writeValue(value: string): void {
        if (value == null || !this.hsvRectangle || !this.hsvPointer) {
            return;
        }
        const rgb = this.hex2rgba(value);
        const hsv = this.rgb2hsv(rgb.r, rgb.g, rgb.b);
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.alpha.set(rgb.a);
        this.hexInputValue.set(value);
        this.hsvPointerLeft = this.getPositionFromSaturation(hsv.s);
        this.hsvPointerTop = this.getPositionFromValue(hsv.v);
        this.cdr.detectChanges();
    }

    private getLongHex(hex: string): string {
        if (hex.length === 4) {
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        return hex;
    }

    private getSaturationFromPosition(): number {
        const minVal = this.hsvPointer.nativeElement.offsetLeft + this.hsvPointer.nativeElement.offsetWidth / 2;
        const maxVal = this.hsvRectangle.nativeElement.offsetWidth;
        return Math.round((minVal / maxVal) * 100);
    }

    private getPositionFromSaturation(saturation: number): number {
        const maxVal = this.hsvRectangle.nativeElement.offsetWidth;
        const minVal = (saturation / 100) * maxVal;
        return minVal - this.hsvPointer.nativeElement.offsetWidth / 2;
    }

    private getPositionFromValue(value: number): number {
        const maxVal = this.hsvRectangle.nativeElement.offsetHeight;
        const minVal = ((100 - value) / 100) * maxVal;
        return minVal - this.hsvPointer.nativeElement.offsetHeight / 2;
    }

    private getValueFromPosition(): number {
        const minVal = this.hsvPointer.nativeElement.offsetTop + this.hsvPointer.nativeElement.offsetHeight / 2;
        const maxVal = this.hsvRectangle.nativeElement.offsetHeight;
        return Math.round(Math.abs(100 - (minVal / maxVal) * 100));
    }

    private hex2rgba(hex: string): RGBA {
        let r = 0,
            g = 0,
            b = 0,
            a = 255;
        if (hex.length == 4 || hex.length == 5) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
            if (hex.length == 5) {
                a = parseInt(hex[4] + hex[4], 16);
            }
        } else if (hex.length == 7 || hex.length == 9) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
            if (hex.length == 9) {
                a = parseInt(hex.slice(7, 9), 16);
            }
        }
        return { r: r, g: g, b: b, a: a };
    }

    private hsv2rgb(hue: number, saturation: number, value: number): { r: number; g: number; b: number } {
        hue = hue / 360;
        saturation = saturation / 100;
        value = value / 100;
        let r = 0;
        let g = 0;
        let b = 0;
        if (saturation === 0) {
            r = value;
            g = value;
            b = value;
        } else {
            const i = Math.floor(hue * 6);
            const f = hue * 6 - i;
            const p = value * (1 - saturation);
            const q = value * (1 - f * saturation);
            const t = value * (1 - (1 - f) * saturation);
            switch (i % 6) {
                case 0:
                    r = value;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = value;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = value;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = value;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = value;
                    break;
                case 5:
                    r = value;
                    g = p;
                    b = q;
                    break;
            }
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    private isValidHex(hex: string): boolean {
        return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
    }

    private rgba2hex(r: number, g: number, b: number, a: number): string {
        let rHex = r.toString(16);
        let gHex = g.toString(16);
        let bHex = b.toString(16);
        let aHex = a.toString(16);

        if (rHex.length == 1) rHex = "0" + rHex;
        if (gHex.length == 1) gHex = "0" + gHex;
        if (bHex.length == 1) bHex = "0" + bHex;
        if (aHex.length == 1) aHex = "0" + aHex;

        return `#${rHex}${gHex}${bHex}${aHex.toUpperCase() !== "FF" ? aHex : ""}`;
    }

    private rgb2hsv(r: number, g: number, b: number): HSV {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    private setHsvRectPointerEvents(): void {
        fromEvent<MouseEvent>(this.hsvPointer.nativeElement, "mousedown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap(() => (this.#pointerMouseDown = true)),
                switchMap(() =>
                    fromEvent<MouseEvent>(document, "mouseup").pipe(
                        takeUntilDestroyed(this.#destroyRef),
                        tap(() => {
                            this.#pointerMouseDown = false;
                            this.#pointerMouseMove = false;
                        })
                    )
                )
            )
            .subscribe();
        fromEvent<MouseEvent>(document, "mousemove")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: MouseEvent) => {
                this.#pointerMouseMove = true;
                if (this.#pointerMouseDown) {
                    this.updateHsvRectPointerPosition(event);
                    this.updateHsvValues();
                    this.updateHexInputValue();
                }
            });
        fromEvent<MouseEvent>(this.hsvRectangle.nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: MouseEvent) => {
                if (!this.#pointerMouseMove) {
                    this.updateHsvRectPointerPosition(event);
                    this.updateHsvValues();
                    this.updateHexInputValue();
                }
            });
    }

    private setSubscriptions(): void {
        this.hueValue$.pipe(distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef)).subscribe((value: number) => {
            this.hsv().h.set(Math.round(value));
            this.updateHsvValues();
            this.updateHexInputValue();
            this.cdr.detectChanges();
        });
        this.setHsvRectPointerEvents();
    }

    private updateHexInputValue(): void {
        const hex = this.rgba2hex(this.rgb().r(), this.rgb().g(), this.rgb().b(), this.alpha());
        this.hexInputValue.set(hex);
    }

    private updateHsvRectPointerPosition(event: MouseEvent): void {
        const containerRect = this.hsvRectangle.nativeElement.getBoundingClientRect();
        const pointerRect = this.hsvPointer.nativeElement.getBoundingClientRect();
        const left = event.clientX - containerRect.left - pointerRect.width / 2;
        const top = event.clientY - containerRect.top - pointerRect.height / 2;

        let newLeft;
        if (left < -pointerRect.width / 2) {
            newLeft = -pointerRect.width / 2;
        } else if (left > containerRect.width - pointerRect.width / 2) {
            newLeft = containerRect.width - pointerRect.width / 2;
        } else {
            newLeft = left;
        }

        let newTop;
        if (top < -pointerRect.height / 2) {
            newTop = -pointerRect.height / 2;
        } else if (top > containerRect.height - pointerRect.height / 2) {
            newTop = containerRect.height - pointerRect.height / 2;
        } else {
            newTop = top;
        }

        this.hsvPointerLeft = newLeft;
        this.hsvPointerTop = newTop;
        this.cdr.detectChanges();
    }

    private updateHsvValues(): void {
        const saturation = this.getSaturationFromPosition();
        const value = this.getValueFromPosition();
        this.hsv().s.set(saturation);
        this.hsv().v.set(value);
        const rgb = this.hsv2rgb(this.hsv().h(), saturation, value);
        if (this.rgb().r() === rgb.r && this.rgb().g() === rgb.g && this.rgb().b() === rgb.b) {
            return;
        }
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.#propagateChange(this.rgba2hex(rgb.r, rgb.g, rgb.b, this.alpha()));
    }
}
