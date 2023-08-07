import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    Input,
    OnChanges,
    OnInit,
    signal,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { SliderTick } from "../../../../models/slider/SliderTick";
import { SliderLabelPosition } from "../../../../models/slider/SliderLabelPosition";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { delay, filter, fromEvent, take, tap } from "rxjs";
import { Action } from "../../../../../utils/Action";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "mona-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true
        }
    ]
})
export class SliderComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #mouseDown: boolean = false;
    #mouseMove: boolean = false;
    #propagateChange: Action<number> | null = null;
    public dragging: WritableSignal<boolean> = signal(false);
    public handlePosition: WritableSignal<number> = signal(0);
    public handleValue: WritableSignal<number> = signal(0);
    public ticks: SliderTick[] = [];

    @Input()
    public disabled: boolean = false;

    @Input()
    public labelPosition: SliderLabelPosition = "after";

    @Input()
    public labelStep: number = 1;

    @Input()
    public max: number = 10;

    @Input()
    public min: number = 0;

    @Input()
    public orientation: "horizontal" | "vertical" = "horizontal";

    @Input()
    public showLabels: boolean = false;

    @Input()
    public showTicks: boolean = false;

    @ViewChild("sliderHandle")
    public sliderHandle!: ElementRef<HTMLDivElement>;

    @Input()
    public step: number = 1;

    @Input()
    public tickStep: number = 1;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<any>;

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>) {}

    public ngAfterViewInit(): void {
        this.setSubscription();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["min"] || changes["max"] || changes["step"]) {
            this.prepareTicks(); // TODO: Use setters and signals to update ticks
        }
    }

    public ngOnInit(): void {
        this.prepareTicks();
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(obj: number): void {
        if (obj != null) {
            const value = Math.max(this.min, Math.min(obj, this.max));
            const position = this.getPositionFromValue(value);
            this.handleValue.set(value);
            this.handlePosition.set(position);
        }
    }

    private getPositionFromValue(value: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        if (this.orientation === "horizontal") {
            if (value === this.min) {
                return 0;
            }
            if (value === this.max) {
                return containerRect.width;
            }
            return ((value - this.min) / (this.max - this.min)) * containerRect.width;
        } else {
            if (value === this.min) {
                return 0;
            }
            if (value === this.max) {
                return containerRect.height;
            }
            return ((value - this.min) / (this.max - this.min)) * containerRect.height;
        }
    }

    private getValueFromPosition(position: number): number {
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        if (this.orientation === "horizontal") {
            const value = position / containerRect.width;
            return Math.max(this.min, Math.min(this.max, Math.round(value * this.max)));
        } else {
            const value = position / containerRect.height;
            return Math.max(this.min, Math.min(this.max, Math.round(value * this.max)));
        }
    }

    private handleHandleMove(event: MouseEvent, direction: "horizontal" | "vertical"): void {
        if (this.showTicks) {
            const tick = this.findClosestTickElement(event);
            const valueStr = tick.getAttribute("data-value");
            const value = valueStr ? Number(valueStr) : 0;
            const position = this.getPositionFromValue(value);
            if (position !== this.handlePosition()) {
                this.handlePosition.set(position);
                this.handleValue.set(value);
                this.#propagateChange?.(value);
            }
            return;
        }

        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const handlePos =
            direction === "horizontal" ? event.clientX - containerRect.left : containerRect.bottom - event.clientY;
        const maxPos = direction === "horizontal" ? containerRect.width : containerRect.height;
        if (handlePos >= 0 && handlePos <= maxPos && handlePos !== this.handlePosition()) {
            const value = this.getValueFromPosition(handlePos);
            if (!this.showTicks) {
                this.handlePosition.set(handlePos);
            }
            if (value !== this.handleValue()) {
                if (this.showTicks && this.handlePosition() !== handlePos) {
                    this.handlePosition.set(handlePos);
                }
                this.handleValue.set(value);
                this.#propagateChange?.(value);
            }
        }
    }

    private setSubscription(): void {
        fromEvent<MouseEvent>(this.sliderHandle.nativeElement, "mousedown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(() => !this.disabled)
            )
            .subscribe(() => {
                this.#mouseDown = true;
                this.dragging.set(true);
                const moveSubscription = fromEvent<MouseEvent>(document, "mousemove").subscribe((event: MouseEvent) => {
                    if (this.#mouseDown) {
                        this.#mouseMove = true;
                        this.handleHandleMove(event, this.orientation);
                    }
                });
                fromEvent<MouseEvent>(document, "mouseup")
                    .pipe(delay(10), take(1))
                    .subscribe(() => {
                        this.#mouseDown = false;
                        this.#mouseMove = false;
                        this.dragging.set(false);
                        moveSubscription.unsubscribe();
                    });
            });

        fromEvent<MouseEvent>(this.elementRef.nativeElement, "click")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap(() => this.dragging.set(false)),
                filter(() => !this.disabled && !this.#mouseMove)
            )
            .subscribe((event: MouseEvent) => {
                this.handleHandleMove(event, this.orientation);
            });

        fromEvent<KeyboardEvent>(this.sliderHandle.nativeElement, "keydown")
            .pipe(
                filter(
                    (event: KeyboardEvent) =>
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowRight" ||
                        event.key === "ArrowUp" ||
                        (event.key === "ArrowDown" && !this.disabled)
                ),
                tap((event: KeyboardEvent) => {
                    this.dragging.set(true);
                    const value = this.handleValue();
                    const step = event.key === "ArrowLeft" || event.key === "ArrowDown" ? -this.step : this.step;
                    const newValue = Math.max(this.min, Math.min(this.max, value + step));
                    this.handleValue.set(newValue);
                    this.handlePosition.set(this.getPositionFromValue(newValue));
                    this.#propagateChange?.(newValue);
                }),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe();
    }

    private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
        const elements = Array.from(
            this.elementRef.nativeElement.querySelectorAll(".mona-slider-tick > span")
        ) as HTMLSpanElement[];
        let maxDistance = Number.MAX_VALUE;
        let index = 0;
        for (const [ex, element] of elements.entries()) {
            const rect = element.getBoundingClientRect();
            const distance = Math.sqrt(Math.pow(rect.left - event.clientX, 2) + Math.pow(rect.top - event.clientY, 2));
            if (distance < maxDistance) {
                maxDistance = distance;
                index = ex;
            }
        }
        return elements[index];
    }

    private prepareTicks(): void {
        let index = 0;
        let value = this.min;
        this.ticks = [];
        while (value < this.max) {
            this.ticks.push({ index, value });
            value += this.step;
            index++;
        }
        this.ticks.push({ index, value: Math.min(value + this.step, this.max) });
        if (this.orientation === "vertical") {
            this.ticks.reverse();
        }
    }
}
