import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, ViewChild } from "@angular/core";
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
    ]
})
export class HueSliderComponent implements AfterViewInit, ControlValueAccessor {
    #mouseDown: boolean = false;
    #mouseMove: boolean = false;
    #propagateChange: (value: number) => void = () => {};

    @ViewChild("sliderHandle")
    public sliderHandle!: ElementRef<HTMLDivElement>;

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>) {}

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
        const value = position / containerRect.height;
        return 360 - value * 360;
    }

    private getPositionFromHue(hue: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const value = (360 - hue) / 360;
        return value * containerRect.height;
    }

    private setHandlePosition(position: number): void {
        const handleElement = this.sliderHandle.nativeElement;
        handleElement.style.top = `${position}px`;
        const hue = this.getHueFromPosition(position);
        this.#propagateChange(hue);
    }

    private setSubscriptions(): void {
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
                const handleTop = event.clientY - containerRect.top - handleRect.height / 2;
                const handleBottom = event.clientY - containerRect.top + handleRect.height / 2;
                if (handleTop >= 0 && handleBottom <= containerRect.height + handleRect.height) {
                    this.setHandlePosition(handleTop);
                }
            }
        });
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "click").subscribe((event: MouseEvent) => {
            if (this.#mouseMove) {
                return;
            }
            const handleElement = this.sliderHandle.nativeElement;
            const top = event.offsetY - handleElement.clientHeight / 2;
            this.setHandlePosition(top);
        });
    }
}
