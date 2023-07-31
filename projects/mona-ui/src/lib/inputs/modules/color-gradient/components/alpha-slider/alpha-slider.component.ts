import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    forwardRef,
    Input,
    ViewChild
} from "@angular/core";
import { delay, fromEvent } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

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
    ]
})
export class AlphaSliderComponent implements AfterViewInit, ControlValueAccessor {
    #mouseDown: boolean = false;
    #mouseMove: boolean = false;
    #propagateChange: (value: number) => void = () => {};

    @Input()
    public color: string = "#000000";

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
        this.setHandlePosition(this.getPositionFromAlpha(value));
    }

    private getAlphaFromPosition(position: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const value = position / containerRect.width;
        return Math.round(value * 255);
    }

    private getPositionFromAlpha(alpha: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const value = alpha / 255;
        return value * containerRect.width;
    }

    private setHandlePosition(position: number): void {
        const handleElement = this.sliderHandle.nativeElement;
        handleElement.style.left = `${position}px`;
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
                const handleTop = event.clientX - containerRect.left - handleRect.width / 2;
                const handleBottom = event.clientX - containerRect.left + handleRect.width / 2;
                if (handleTop >= 0 && handleBottom <= containerRect.width + handleRect.width) {
                    this.setHandlePosition(handleTop);
                    const alpha = this.getAlphaFromPosition(handleTop);
                    this.#propagateChange(alpha);
                }
            }
        });
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "click").subscribe((event: MouseEvent) => {
            if (this.#mouseMove) {
                return;
            }
            const handleElement = this.sliderHandle.nativeElement;
            const top = event.offsetX - handleElement.clientWidth / 2;
            const alpha = this.getAlphaFromPosition(top);
            this.#propagateChange(alpha);
            this.setHandlePosition(top);
        });
    }
}
