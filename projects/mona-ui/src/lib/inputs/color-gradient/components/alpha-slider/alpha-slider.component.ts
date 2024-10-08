import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    forwardRef,
    inject,
    input,
    NgZone,
    Signal,
    viewChild
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { delay, fromEvent } from "rxjs";

@Component({
    selector: "mona-alpha-slider",
    templateUrl: "./alpha-slider.component.html",
    styleUrls: ["./alpha-slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AlphaSliderComponent),
            multi: true
        }
    ],
    standalone: true
})
export class AlphaSliderComponent implements AfterViewInit, ControlValueAccessor {
    readonly #hostElementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    readonly #zone: NgZone = inject(NgZone);
    #mouseDown = false;
    #mouseMove = false;
    #propagateChange: (value: number) => void = () => {};

    protected readonly sliderHandle: Signal<ElementRef<HTMLDivElement>> = viewChild.required("sliderHandle");

    public color = input<string>("#000000");

    public ngAfterViewInit(): void {
        this.setSubscriptions();
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(value: number): void {
        if (value == null || !this.sliderHandle()) {
            return;
        }
        window.setTimeout(() => {
            this.setHandlePosition(this.getPositionFromAlpha(value));
        });
    }

    private getAlphaFromPosition(position: number): number {
        const containerRect = this.#hostElementRef.nativeElement.getBoundingClientRect();
        const handleRect = this.sliderHandle().nativeElement.getBoundingClientRect();
        const value = (position - handleRect.width / 2) / containerRect.width;
        return Math.max(0, Math.min(255, Math.ceil(value * 255)));
    }

    private getPositionFromAlpha(alpha: number): number {
        const containerRect = this.#hostElementRef.nativeElement.getBoundingClientRect();
        const handleRect = this.sliderHandle().nativeElement.getBoundingClientRect();
        const value = alpha / 255;
        if (value === 0) {
            return handleRect.width / 2;
        }
        if (value === 1) {
            return containerRect.width + handleRect.width / 2;
        }
        return Math.round(value * containerRect.width);
    }

    private setHandlePosition(position: number): void {
        const handleElement = this.sliderHandle().nativeElement;
        handleElement.style.left = `${position}px`;
    }

    private setSubscriptions(): void {
        this.#zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.sliderHandle().nativeElement, "mousedown").subscribe(() => {
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
                    const containerRect = this.#hostElementRef.nativeElement.getBoundingClientRect();
                    const handleElement = this.sliderHandle().nativeElement;
                    const handleRect = handleElement.getBoundingClientRect();
                    const handlePos = event.clientX - containerRect.left + handleRect.width / 2;
                    if (handlePos >= handleRect.width / 2 && handlePos <= containerRect.width + handleRect.width / 2) {
                        this.#zone.run(() => {
                            this.setHandlePosition(handlePos);
                            const alpha = this.getAlphaFromPosition(handlePos);
                            this.#propagateChange(alpha);
                        });
                    }
                }
            });
            fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click").subscribe((event: MouseEvent) => {
                if (this.#mouseMove) {
                    return;
                }
                const containerRect = this.#hostElementRef.nativeElement.getBoundingClientRect();
                const handleElement = this.sliderHandle().nativeElement;
                const handleRect = handleElement.getBoundingClientRect();
                const handlePos = event.clientX - containerRect.left + handleRect.width / 2;
                if (handlePos >= handleRect.width / 2 && handlePos <= containerRect.width + handleRect.width / 2) {
                    this.#zone.run(() => {
                        this.setHandlePosition(handlePos);
                        const alpha = this.getAlphaFromPosition(handlePos);
                        this.#propagateChange(alpha);
                    });
                }
            });
        });
    }
}
