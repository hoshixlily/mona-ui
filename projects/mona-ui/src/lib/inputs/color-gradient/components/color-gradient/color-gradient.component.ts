import { Clipboard } from "@angular/cdk/clipboard";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    NgZone,
    OnInit,
    output,
    Signal,
    signal,
    viewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { distinctUntilChanged, fromEvent, Subject, switchMap, takeUntil } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ContextMenuComponent } from "../../../../menus/context-menu/context-menu.component";
import { MenuItemComponent } from "../../../../menus/menu-item/menu-item.component";
import { ColorMode, ColorOutputFormat } from "../../../models/ColorMode";
import { Channel, HSLA, HSV, HSVA, HSVSignal, RGBA, RGBSignal } from "../../../models/ColorSpaces";
import { NumericTextBoxComponent } from "../../../numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { NumericTextBoxPrefixTemplateDirective } from "../../../numeric-text-box/directives/numeric-text-box-prefix-template.directive";
import { TextBoxComponent } from "../../../text-box/components/text-box/text-box.component";
import { TextBoxPrefixTemplateDirective } from "../../../text-box/directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "../../../text-box/directives/text-box-suffix-template.directive";
import { AlphaSliderComponent } from "../alpha-slider/alpha-slider.component";
import { HueSliderComponent } from "../hue-slider/hue-slider.component";

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
    ],
    standalone: true,
    imports: [
        HueSliderComponent,
        FormsModule,
        AlphaSliderComponent,
        NumericTextBoxComponent,
        NumericTextBoxPrefixTemplateDirective,
        ButtonDirective,
        TextBoxComponent,
        TextBoxPrefixTemplateDirective,
        TextBoxSuffixTemplateDirective,
        ContextMenuComponent,
        MenuItemComponent
    ],
    host: {
        class: "mona-color-gradient"
    }
})
export class ColorGradientComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    readonly #clipboard: Clipboard = inject(Clipboard);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #valueChange$: Subject<string | null> = new Subject<string | null>();
    readonly #zone: NgZone = inject(NgZone);
    #propagateChange: (value: string | null) => void = () => {};
    protected readonly alpha: WritableSignal<number> = signal(255);
    protected readonly alphaInputColor: Signal<string> = computed(() => {
        const rgb = this.rgb();
        return this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), 255);
    });
    protected readonly colorMode: WritableSignal<ColorMode> = signal("rgb");
    protected readonly hex: Signal<string> = computed(() => {
        const rgb = this.rgb();
        const alpha = this.alpha();
        const focused = this.hexFocused();
        if (!focused) {
            return this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), alpha);
        }
        return this.hexInputValue();
    });
    protected readonly hexFocused: WritableSignal<boolean> = signal(false);
    protected readonly hexInputValue: WritableSignal<string> = signal("");
    protected readonly hsv: WritableSignal<HSVSignal> = signal<HSVSignal>({
        h: signal(255),
        s: signal(255),
        v: signal(255)
    });
    protected readonly hsvRectBackground: Signal<string> = computed(() => {
        const hsv = this.hsv();
        const rgb = this.hsva2rgba(hsv.h(), 100, 100, 255);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    });
    protected readonly hsvPointer: Signal<ElementRef<HTMLDivElement>> = viewChild.required("hsvPointer");
    protected readonly hsvPointerLeft: WritableSignal<number> = signal(0);
    protected readonly hsvPointerTop: WritableSignal<number> = signal(0);
    protected readonly hsvRectangle: Signal<ElementRef<HTMLDivElement>> = viewChild.required("hsvRectangle");
    protected readonly hueValue$: Subject<number> = new Subject<number>();
    protected readonly lastSelectedColor: WritableSignal<string> = signal("");
    protected readonly rgb: WritableSignal<RGBSignal> = signal<RGBSignal>({
        r: signal(255),
        g: signal(255),
        b: signal(255)
    });
    protected readonly selectedColor: Signal<string> = computed(() => {
        const rgb = this.rgb();
        const { red, green, blue } = { red: rgb.r(), green: rgb.g(), blue: rgb.b() };
        if (red == null || green == null || blue == null) {
            return "";
        }
        return `rgba(${red}, ${green}, ${blue}, ${this.alpha() / 255})`;
    });

    public readonly apply = output<void>();
    public readonly cancel = output<void>();

    /**
     * Specifies the format of the color output.
     */
    public format = input<ColorOutputFormat>("hex");

    /**
     * Specifies whether the color picker should display the alpha slider.
     * @default true
     */
    public opacity = input<boolean>(true);

    /**
     * Specifies whether the color picker should display the buttons.
     * When set to true, the color picker will display the "Apply" and "Cancel" buttons.
     * When set to false, the color picker will not display the buttons and will emit the color value on change.
     * @default true
     */
    public showButtons = input<boolean>(true);

    /**
     * Specifies whether the color picker should display the hex input.
     * @default true
     */
    public showHexInput = input<boolean>(true);

    /**
     * Specifies whether the color picker should display the RGB input.
     * @default true
     */
    public showRgbInput = input<boolean>(true);

    public ngAfterViewInit() {
        this.setSubscriptions();
    }

    public ngOnInit(): void {
        this.lastSelectedColor.set(this.hex());
    }

    public onAlphaChange(value: number): void {
        if (value == null) {
            return;
        }
        value = this.getValidChannelValue(value, "a");
        this.alpha.set(value);
        this.updateHexInputValue();
        if (!this.showButtons()) {
            this.emitValue();
        }
    }

    public onApply(): void {
        this.lastSelectedColor.set(this.hex());
        this.emitValue();
        this.apply.emit();
    }

    public onCancel(): void {
        this.hexInputValue.set(this.lastSelectedColor());
        this.cancel.emit();
    }

    public onClearClick(): void {
        this.clear();
        if (!this.showButtons()) {
            this.emitValue(null);
        }
    }

    public onCopyColorSelect(mode: "hex" | "rgb"): void {
        if (mode === "hex") {
            this.#clipboard.copy(this.hex());
        } else if (mode === "rgb") {
            const rgb = this.rgb();
            const alpha = Math.round((this.alpha() / 255) * 100) / 100;
            this.#clipboard.copy(`rgba(${rgb.r()}, ${rgb.g()}, ${rgb.b()}, ${alpha})`);
        }
    }

    public onHexChange(value: string): void {
        this.hexInputValue.set(value);
        if (!this.isValidHex(value)) {
            return;
        }
        const rgb = this.hex2rgba(value);
        const hsv = this.rgba2hsva(rgb.r, rgb.g, rgb.b, rgb.a);
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.alpha.set(rgb.a ?? 255);
        this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s));
        this.hsvPointerTop.set(this.getPositionFromValue(hsv.v));
        if (!this.showButtons()) {
            this.emitValue();
        }
    }

    public onHexInputBlur(): void {
        this.updateHexInputValue();
    }

    public onHexInputFocus(): void {
        this.hexFocused.set(true);
    }

    public onHsvChange(value: number, channel: "h" | "s" | "v"): void {
        if (value == null) {
            return;
        }

        value = this.getValidChannelValue(value, channel);

        const hsv = this.hsv();
        hsv[channel].set(value);
        this.updateOtherNullChannels(channel);

        const rgb = this.hsva2rgba(hsv.h(), hsv.s(), hsv.v(), this.alpha());
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.updateHexInputValue();
        this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s()));
        this.hsvPointerTop.set(this.getPositionFromValue(hsv.v()));
        if (!this.showButtons()) {
            this.emitValue();
        }
    }

    public onResetColorClick(): void {
        this.onHexChange(this.lastSelectedColor());
    }

    public onRgbChange(value: number, channel: "r" | "g" | "b"): void {
        if (value == null) {
            return;
        }
        value = this.getValidChannelValue(value, channel);

        const rgb = this.rgb();
        rgb[channel].set(value);
        this.updateOtherNullChannels(channel);

        const hsv = this.rgba2hsva(rgb.r(), rgb.g(), rgb.b(), this.alpha());
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
        this.updateHexInputValue();
        this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s));
        this.hsvPointerTop.set(this.getPositionFromValue(hsv.v));
        if (!this.showButtons()) {
            this.emitValue();
        }
    }

    public onSwitchColorModeClick(): void {
        this.colorMode.set(this.colorMode() === "rgb" ? "hsv" : "rgb");
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(value: string): void {
        if (!this.hsvRectangle() || !this.hsvPointer()) {
            return;
        }
        if (value == null) {
            this.clear();
            return;
        }
        this.loadColorFromString(value);
        this.lastSelectedColor.set(this.hex());
    }

    private clear(): void {
        this.hexInputValue.set("");
        this.lastSelectedColor.set("");
        this.rgb().r.set(null);
        this.rgb().g.set(null);
        this.rgb().b.set(null);
        this.alpha.set(255);
        this.hsv().h.set(null);
        this.hsv().s.set(null);
        this.hsv().v.set(null);
    }

    private emitValue(value?: string | null): void {
        if (value !== undefined) {
            this.#valueChange$.next(value);
            return;
        }
        const format = this.format();
        const rgb = this.rgb();
        const alpha = this.alpha();

        const { red, green, blue } = { red: rgb.r(), green: rgb.g(), blue: rgb.b() };
        if (red == null || green == null || blue == null || alpha == null) {
            this.#valueChange$.next(null);
            return;
        }

        if (format === "hex") {
            this.#valueChange$.next(this.rgba2hex(red, green, blue, alpha));
        } else if (format === "rgb") {
            this.#valueChange$.next(`rgba(${red}, ${green}, ${blue}, ${alpha / 255})`);
        } else if (format === "hsl") {
            const hsl = this.rgba2hsla(red, green, blue, alpha);
            this.#valueChange$.next(`hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha / 255})`);
        }
    }

    private getSaturationFromPosition(): number {
        const minVal = this.hsvPointer().nativeElement.offsetLeft + this.hsvPointer().nativeElement.offsetWidth / 2;
        const maxVal = this.hsvRectangle().nativeElement.offsetWidth;
        return Math.ceil((minVal / maxVal) * 100);
    }

    private getPositionFromSaturation(saturation: number | null): number {
        if (saturation == null) {
            return 0;
        }
        const maxVal = this.hsvRectangle().nativeElement.offsetWidth;
        const minVal = (saturation / 100) * maxVal;
        return minVal - this.hsvPointer().nativeElement.offsetWidth / 2;
    }

    private getPositionFromValue(value: number | null): number {
        if (value == null) {
            return 0;
        }
        const maxVal = this.hsvRectangle().nativeElement.offsetHeight;
        const minVal = ((100 - value) / 100) * maxVal;
        return minVal - this.hsvPointer().nativeElement.offsetHeight / 2;
    }

    private getValidChannelValue(value: number, channel: Channel): number {
        if (channel === "r" || channel === "g" || channel === "b" || channel === "a") {
            return Math.min(255, Math.max(0, value));
        }
        if (channel === "h") {
            return Math.min(360, Math.max(0, value));
        }
        if (channel === "s" || channel === "v") {
            return Math.min(100, Math.max(0, value));
        }
        return value;
    }

    private getValueFromPosition(): number {
        const minVal = this.hsvPointer().nativeElement.offsetTop + this.hsvPointer().nativeElement.offsetHeight / 2;
        const maxVal = this.hsvRectangle().nativeElement.offsetHeight;
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

    private hsla2hsva(
        hue: number | null,
        saturation: number | null,
        lightness: number | null,
        alpha: number | null
    ): HSVA {
        if (hue == null || saturation == null || lightness == null) {
            return { h: 0, s: 0, v: 0, a: 255 };
        }

        const h = hue;
        const s = saturation / 100;
        const l = lightness / 100;

        const v = l + s * Math.min(l, 1 - l);
        const sv = v === 0 ? 0 : 2 * (1 - l / v);
        return {
            h: h,
            s: sv * 100,
            v: v * 100,
            a: alpha ?? 255
        };
    }

    private hsva2rgba(hue: number | null, saturation: number | null, value: number | null, alpha: number | null): RGBA {
        if (hue == null || saturation == null || value == null) {
            return { r: 0, g: 0, b: 0, a: 255 };
        }
        const h = hue;
        const s = saturation / 100;
        const v = value / 100;
        const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
        return {
            r: Math.round(f(5) * 255),
            g: Math.round(f(3) * 255),
            b: Math.round(f(1) * 255),
            a: alpha ?? 255
        };
    }

    private isValidHex(hex: string): boolean {
        return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
    }

    private isValidHsla(hslaText: string): boolean {
        return /^hsla?\(\s*(\d{1,2}|[1-2]\d{2}|3[0-5]\d|360)\s*,\s*(\d{1,2}|100)%\s*,\s*(\d{1,2}|100)%\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/.test(
            hslaText
        );
    }

    private isValidRgb(rgbText: string): boolean {
        return /^rgba?\(\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/.test(
            rgbText
        );
    }

    private loadColorFromString(color: string): void {
        if (color == null || !this.hsvRectangle() || !this.hsvPointer()) {
            return;
        }

        const isValidHex = this.isValidHex(color);
        const isValidHsv = this.isValidHsla(color);
        const isValidRgb = this.isValidRgb(color);

        let rgba: RGBA;
        let hsla: HSLA | undefined;
        let hsva: HSVA | undefined;
        if (isValidHex) {
            rgba = this.hex2rgba(color);
        } else if (isValidRgb) {
            rgba = this.string2rgba(color);
        } else if (isValidHsv) {
            hsla = this.string2Hsla(color);
            hsva = this.hsla2hsva(hsla.h, hsla.s, hsla.l, hsla.a);
            rgba = this.hsva2rgba(hsva.h, hsva.s, hsva.v, hsva.a);
            hsva = {
                h: Math.round(hsva.h as number),
                s: Math.round(hsva.s as number),
                v: Math.round(hsva.v as number),
                a: hsva.a
            };
        } else {
            rgba = { r: null, g: null, b: null, a: null };
        }

        if (!hsva) {
            hsva = this.rgba2hsva(rgba.r, rgba.g, rgba.b, rgba.a);
        }

        this.updateHsvSignal(hsva);
        this.updateRgbaSignals(rgba);
        this.alpha.set(rgba.a ?? 255);
        this.hexInputValue.set(this.hex());
        window.setTimeout(() => {
            this.hsvPointerLeft.set(this.getPositionFromSaturation(hsva.s));
            this.hsvPointerTop.set(this.getPositionFromValue(hsva.v));
        });
    }

    private rgba2hex(r: number | null, g: number | null, b: number | null, a: number | null): string {
        if (r == null || g == null || b == null || a == null) {
            return "";
        }

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

    private rgba2hsla(red: number | null, green: number | null, blue: number | null, alpha: number | null): HSLA {
        if (red == null || green == null || blue == null) {
            return { h: 0, s: 0, l: 0, a: 255 };
        }
        const r = red / 255;
        const g = green / 255;
        const b = blue / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s: number;
        const l = (max + min) / 2;
        const d = max - min;
        if (d === 0) {
            h = s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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
            l: Math.round(l * 100),
            a: alpha ?? 255
        };
    }

    private rgba2hsva(r: number | null, g: number | null, b: number | null, a: number | null): HSVA {
        if (r == null || g == null || b == null) {
            return { h: 0, s: 0, v: 0, a: 255 };
        }

        r = r / 255;
        g = g / 255;
        b = b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s: number;
        const v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max !== min) {
            if (max === r) {
                h = (g - b) / d + (g < b ? 6 : 0);
            } else if (max === g) {
                h = (b - r) / d + 2;
            } else if (max === b) {
                h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100),
            a: a ?? 255
        };
    }

    private setHsvRectPointerEvents(): void {
        const mouseDown$ = fromEvent<MouseEvent>(this.hsvPointer().nativeElement, "mousedown").pipe(
            takeUntilDestroyed(this.#destroyRef)
        );
        const mouseMove$ = fromEvent<MouseEvent>(document, "mousemove").pipe(takeUntilDestroyed(this.#destroyRef));
        const mouseUp$ = fromEvent<MouseEvent>(document, "mouseup").pipe(takeUntilDestroyed(this.#destroyRef));
        mouseDown$.pipe(switchMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))).subscribe((event: MouseEvent) => {
            this.#zone.run(() => {
                this.updateHsvRectPointerPosition(event);
                this.updateHsvValues();
                this.updateHexInputValue();
            });
        });
        fromEvent<MouseEvent>(this.hsvRectangle().nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: MouseEvent) => {
                this.updateHsvRectPointerPosition(event);
                window.setTimeout(() => {
                    this.updateHsvValues();
                    this.updateHexInputValue();
                });
            });
    }

    private setSubscriptions(): void {
        this.hueValue$.pipe(distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef)).subscribe((value: number) => {
            this.hsv().h.set(Math.round(value));
            this.updateHsvValues();
            this.updateHexInputValue();
        });
        this.setHsvRectPointerEvents();
        this.#valueChange$
            .pipe(takeUntilDestroyed(this.#destroyRef), distinctUntilChanged())
            .subscribe((value: string | null) => this.#propagateChange(value));
    }

    private string2Hsla(hslText: string): HSLA {
        const match = RegExp(
            /^hsla?\(\s*(\d{1,2}|[1-2]\d{2}|3[0-5]\d|360)\s*,\s*(\d{1,2}|100)%\s*,\s*(\d{1,2}|100)%\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/
        ).exec(hslText);
        if (match) {
            return {
                h: parseInt(match[1]),
                s: parseInt(match[2]),
                l: parseInt(match[3]),
                a: match[4] ? Math.round(parseFloat(match[4]) * 255) : 255
            };
        }
        return { h: 0, s: 0, l: 0, a: 255 };
    }

    private string2rgba(rgbText: string): RGBA {
        const match = RegExp(
            /^rgba?\(\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/
        ).exec(rgbText);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? Math.round(parseFloat(match[4]) * 255) : 255
            };
        }
        return { r: 0, g: 0, b: 0, a: 255 };
    }

    private updateHexInputValue(): void {
        const hex = this.rgba2hex(this.rgb().r(), this.rgb().g(), this.rgb().b(), this.alpha());
        this.hexInputValue.set(hex);
    }

    private updateHsvRectPointerPosition(event: MouseEvent): void {
        const containerRect = this.hsvRectangle().nativeElement.getBoundingClientRect();
        const pointerRect = this.hsvPointer().nativeElement.getBoundingClientRect();
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

        this.hsvPointerLeft.set(newLeft);
        this.hsvPointerTop.set(newTop);
    }

    private updateHsvSignal(hsv: HSV): void {
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
    }

    private updateHsvValues(): void {
        const saturation = this.getSaturationFromPosition();
        const value = this.getValueFromPosition();
        const hue = this.hsv().h();
        if (hue === null) {
            this.hsv().h.set(0);
        }

        this.hsv().s.set(saturation);
        this.hsv().v.set(value);
        const rgb = this.hsva2rgba(this.hsv().h(), saturation, value, this.alpha());
        if (this.rgb().r() === rgb.r && this.rgb().g() === rgb.g && this.rgb().b() === rgb.b) {
            return;
        }
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        if (!this.showButtons()) {
            this.emitValue();
        }
    }

    private updateOtherNullChannels(channel: keyof RGBA | keyof HSV): void {
        if (channel === "r" || channel === "g" || channel === "b") {
            this.rgb().r.set(this.rgb().r() ?? 0);
            this.rgb().g.set(this.rgb().g() ?? 0);
            this.rgb().b.set(this.rgb().b() ?? 0);
        } else if (channel === "h" || channel === "s" || channel === "v") {
            this.hsv().h.set(this.hsv().h() ?? 0);
            this.hsv().s.set(this.hsv().s() ?? 0);
            this.hsv().v.set(this.hsv().v() ?? 0);
        } else if (channel === "a") {
            this.alpha.set(this.alpha() ?? 255);
        }
    }

    private updateRgbaSignals(rgba: RGBA): void {
        this.rgb().r.set(rgba.r);
        this.rgb().g.set(rgba.g);
        this.rgb().b.set(rgba.b);
    }
}
