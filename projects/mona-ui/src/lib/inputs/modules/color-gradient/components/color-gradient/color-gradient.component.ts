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

export interface HSV {
    h: WritableSignal<number>;
    s: WritableSignal<number>;
    v: WritableSignal<number>;
}

export interface RGB {
    r: WritableSignal<number>;
    g: WritableSignal<number>;
    b: WritableSignal<number>;
}

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
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #pointerMouseDown: boolean = false;
    #pointerMouseMove: boolean = false;
    #propagateChange: (value: string) => void = () => {};
    public readonly hueValue$: Subject<number> = new Subject<number>();
    public hsv: WritableSignal<HSV> = signal<HSV>({ h: signal(255), s: signal(255), v: signal(255) });
    public hsvRectBackground: Signal<string> = signal("");
    public hsvPointerLeft: number = 0;
    public hsvPointerTop: number = 0;
    public rgb: WritableSignal<RGB> = signal<RGB>({ r: signal(255), g: signal(255), b: signal(255) });
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
        // const hsv = this.rgb2hsv(255, 0, 0);
        // this.hsv().h.set(hsv.h);
        // this.rgb().r.set(255);
        // this.rgb().g.set(0);
        // this.rgb().b.set(0);
        // this.hsvPointerLeft = this.getPositionFromSaturation(hsv.s);
        // this.hsvPointerTop = this.getPositionFromValue(hsv.v);
    }

    public ngOnInit(): void {
        this.hsvRectBackground = computed(() => {
            const hsv = this.hsv();
            const rgb = this.hsv2rgb(hsv.h(), 100, 100);
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        });
        this.selectedColor = computed(() => {
            const rgb = this.rgb();
            return `rgb(${rgb.r()}, ${rgb.g()}, ${rgb.b()})`;
        });
    }

    public registerOnChange(fn: any) {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any) {}

    public writeValue(value: string): void {
        if (value == null || !this.hsvRectangle || !this.hsvPointer) {
            return;
        }
        const rgb = this.hex2rgb(value);
        const hsv = this.rgb2hsv(rgb.r, rgb.g, rgb.b);
        this.hsv().h.set(hsv.h);
        this.hsv().s.set(hsv.s);
        this.hsv().v.set(hsv.v);
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.hsvPointerLeft = this.getPositionFromSaturation(hsv.s);
        this.hsvPointerTop = this.getPositionFromValue(hsv.v);
        this.cdr.detectChanges();
    }

    private getSaturationFromPosition(): number {
        const minVal = this.hsvPointer.nativeElement.offsetLeft + this.hsvPointer.nativeElement.offsetWidth / 2;
        const maxVal = this.hsvRectangle.nativeElement.offsetWidth;
        return (minVal / maxVal) * 100;
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
        return Math.abs(100 - (minVal / maxVal) * 100);
    }

    private hex2rgb(hex: string): { r: number; g: number; b: number } {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
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

    private rgb2hex(r: number, g: number, b: number): string {
        const rgb = b | (g << 8) | (r << 16);
        return "#" + (0x1000000 + rgb).toString(16).slice(1);
    }

    private rgb2hsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
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

    private setHsvRectBackground(hue: number): void {
        const { r, g, b } = this.hsv2rgb(hue, 100, 100);
        this.rgb().r.set(r);
        this.rgb().g.set(g);
        this.rgb().b.set(b);
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
                }
            });
        fromEvent<MouseEvent>(this.hsvRectangle.nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: MouseEvent) => {
                if (!this.#pointerMouseMove) {
                    this.updateHsvRectPointerPosition(event);
                    this.updateHsvValues();
                }
            });
    }

    private setSubscriptions(): void {
        this.hueValue$.pipe(distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef)).subscribe((value: number) => {
            this.hsv().h.set(value);
            this.setHsvRectBackground(value);
            this.cdr.detectChanges();
        });
        this.setHsvRectPointerEvents();
    }

    private updateHsvRectPointerPosition(event: MouseEvent): void {
        const containerRect = this.hsvRectangle.nativeElement.getBoundingClientRect();
        const pointerRect = this.hsvPointer.nativeElement.getBoundingClientRect();
        const left = event.clientX - containerRect.left - pointerRect.width / 2;
        const top = event.clientY - containerRect.top - pointerRect.height / 2;

        if (top === this.hsvPointerTop && left === this.hsvPointerLeft) {
            return;
        }

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

        if (newLeft === this.hsvPointerLeft && newTop === this.hsvPointerTop) {
            return;
        }

        this.hsvPointerLeft = newLeft;
        this.hsvPointerTop = newTop;
        this.cdr.detectChanges();
    }

    private updateHsvValues(): void {
        const saturation = this.getSaturationFromPosition();
        const value = this.getValueFromPosition();
        if (this.hsv().s() === saturation && this.hsv().v() === value) {
            return;
        }
        const rgb = this.hsv2rgb(this.hsv().h(), saturation, value);
        if (this.rgb().r() === rgb.r && this.rgb().g() === rgb.g && this.rgb().b() === rgb.b) {
            return;
        }
        console.log("updateHsvValues", rgb);
        console.log("updateHsvValues", [saturation, value]);
        this.rgb().r.set(rgb.r);
        this.rgb().g.set(rgb.g);
        this.rgb().b.set(rgb.b);
        this.#propagateChange(this.rgb2hex(rgb.r, rgb.g, rgb.b));
    }
}
