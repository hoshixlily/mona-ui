import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    forwardRef,
    NgZone,
    ViewChild
} from "@angular/core";
import { delay, fromEvent } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "mona-hue-slider",
    templateUrl: "./hue-slider.component.html",
    styleUrls: ["./hue-slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HueSliderComponent),
            multi: true
        }
    ],
    standalone: true
})
export class HueSliderComponent implements AfterViewInit, ControlValueAccessor {
    #mouseDown: boolean = false;
    #mouseMove: boolean = false;
    #propagateChange: (value: number) => void = () => {};

    @ViewChild("sliderHandle")
    public sliderHandle!: ElementRef<HTMLDivElement>;

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>, private readonly zone: NgZone) {}

    public ngAfterViewInit(): void {
        this.setSubscriptions();
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(value: number): void {
        if (value == null || !this.sliderHandle) {
            return;
        }
        this.setHandlePosition(this.getPositionFromHue(value));
    }

    private getHueFromPosition(position: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const handleRect = this.sliderHandle.nativeElement.getBoundingClientRect();
        const value = (position - handleRect.width / 2) / containerRect.width;
        return Math.max(0, Math.min(360, Math.round(value * 360)));
    }

    private getPositionFromHue(hue: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const handleRect = this.sliderHandle.nativeElement.getBoundingClientRect();
        const value = hue / 360;
        if (value === 0) {
            return handleRect.width / 2;
        }
        if (value === 1) {
            return containerRect.width + handleRect.width / 2;
        }
        return Math.round(value * containerRect.width);
    }

    private setHandlePosition(position: number): void {
        const handleElement = this.sliderHandle.nativeElement;
        handleElement.style.left = `${position}px`;
    }

    private setSubscriptions(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.sliderHandle.nativeElement, "mousedown").subscribe(() => {
                this.#mouseDown = true;
                fromEvent<MouseEvent>(document, "mouseup")
                    .pipe(delay(10))
                    .subscribe(() => {
                        this.#mouseDown = false;
                        this.#mouseMove = false;
                    });
            });
            fromEvent<MouseEvent>(document, "mousemove").subscribe((event: MouseEvent) => {
                if (this.#mouseDown) {
                    this.#mouseMove = true;
                    const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
                    const handleElement = this.sliderHandle.nativeElement;
                    const handleRect = handleElement.getBoundingClientRect();
                    const handlePos = event.clientX - containerRect.left + handleRect.width / 2;
                    if (handlePos >= handleRect.width / 2 && handlePos <= containerRect.width + handleRect.width / 2) {
                        this.zone.run(() => {
                            this.setHandlePosition(handlePos);
                            const hue = this.getHueFromPosition(handlePos);
                            this.#propagateChange(hue);
                        });
                    }
                }
            });
            fromEvent<MouseEvent>(this.elementRef.nativeElement, "click").subscribe((event: MouseEvent) => {
                if (this.#mouseMove) {
                    return;
                }
                const handleElement = this.sliderHandle.nativeElement;
                const left = event.offsetX + handleElement.clientWidth / 2;
                const hue = this.getHueFromPosition(left);
                this.zone.run(() => {
                    this.#propagateChange(hue);
                    this.setHandlePosition(left);
                });
            });
        });
    }
}
