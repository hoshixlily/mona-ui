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
    InputSignal,
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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCopy, faSort, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { distinctUntilChanged, fromEvent, Subject, switchMap, tap } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ContextMenuComponent } from "../../../../menus/context-menu/context-menu.component";
import { MenuItemComponent } from "../../../../menus/menu-item/menu-item.component";
import { ColorMode } from "../../../models/ColorMode";
import { HSV, HSVSignal, RGB, RGBA, RGBSignal } from "../../../models/ColorSpaces";
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
        FontAwesomeModule,
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
    readonly #zone: NgZone = inject(NgZone);
    #pointerMouseDown: boolean = false;
    #pointerMouseMove: boolean = false;
    #propagateChange: (value: string) => void = () => {};
    protected readonly alpha: WritableSignal<number> = signal(255);
    protected readonly alphaInputColor: Signal<string> = computed(() => {
        const rgb = this.rgb();
        return this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), 255);
    });
    protected readonly colorMode: WritableSignal<ColorMode> = signal("rgb");
    protected readonly copyIcon: IconDefinition = faCopy;
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
        const rgb = this.hsv2rgb(hsv.h(), 100, 100);
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
        return `rgba(${rgb.r()}, ${rgb.g()}, ${rgb.b()}, ${this.alpha() / 255})`;
    });
    protected readonly switchIcon: IconDefinition = faSort;

    public readonly apply = output<void>();
    public readonly cancel = output<void>();

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
        this.alpha.set(value);
        this.updateHexInputValue();
        if (!this.showButtons()) {
            this.#propagateChange(this.hex());
        }
    }

    public onApply(): void {
        this.lastSelectedColor.set(this.hex());
        this.#propagateChange(this.hex());
        this.apply.emit();
    }

    public onCancel(): void {
        this.hexInputValue.set(this.lastSelectedColor());
        this.cancel.emit();
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

    public onResetColorClick(): void {
        this.onHexChange(this.lastSelectedColor());
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
        this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s));
        this.hsvPointerTop.set(this.getPositionFromValue(hsv.v));
        if (!this.showButtons()) {
            this.#propagateChange(this.rgba2hex(rgb.r(), rgb.g(), rgb.b(), this.alpha()));
        }
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
        this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s()));
        this.hsvPointerTop.set(this.getPositionFromValue(hsv.v()));
        if (!this.showButtons()) {
            this.#propagateChange(this.rgba2hex(rgb.r, rgb.g, rgb.b, this.alpha()));
        }
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
        this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s));
        this.hsvPointerTop.set(this.getPositionFromValue(hsv.v));
        if (!this.showButtons()) {
            this.#propagateChange(value);
        }
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
        window.setTimeout(() => {
            this.hsvPointerLeft.set(this.getPositionFromSaturation(hsv.s));
            this.hsvPointerTop.set(this.getPositionFromValue(hsv.v));
        });
        this.lastSelectedColor.set(this.hex());
    }

    private getSaturationFromPosition(): number {
        const minVal = this.hsvPointer().nativeElement.offsetLeft + this.hsvPointer().nativeElement.offsetWidth / 2;
        const maxVal = this.hsvRectangle().nativeElement.offsetWidth;
        return Math.round((minVal / maxVal) * 100);
    }

    private getPositionFromSaturation(saturation: number): number {
        const maxVal = this.hsvRectangle().nativeElement.offsetWidth;
        const minVal = (saturation / 100) * maxVal;
        return minVal - this.hsvPointer().nativeElement.offsetWidth / 2;
    }

    private getPositionFromValue(value: number): number {
        const maxVal = this.hsvRectangle().nativeElement.offsetHeight;
        const minVal = ((100 - value) / 100) * maxVal;
        return minVal - this.hsvPointer().nativeElement.offsetHeight / 2;
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

    private hsv2rgb(hue: number, saturation: number, value: number): RGB {
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
            v: Math.round(v * 100)
        };
    }

    private setHsvRectPointerEvents(): void {
        this.#zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(document, "mousemove")
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe((event: MouseEvent) => {
                    if (this.#pointerMouseDown) {
                        this.#zone.run(() => {
                            this.#pointerMouseMove = true;
                            this.updateHsvRectPointerPosition(event);
                            this.updateHsvValues();
                            this.updateHexInputValue();
                        });
                    }
                });
        });
        fromEvent<MouseEvent>(this.hsvPointer().nativeElement, "mousedown")
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
        fromEvent<MouseEvent>(this.hsvRectangle().nativeElement, "click")
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
        });
        this.setHsvRectPointerEvents();
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
        if (!this.showButtons()) {
            this.#propagateChange(this.rgba2hex(rgb.r, rgb.g, rgb.b, this.alpha()));
        }
    }
}
