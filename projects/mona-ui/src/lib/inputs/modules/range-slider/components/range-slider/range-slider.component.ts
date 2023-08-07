import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    Input,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { delay, filter, from, fromEvent, map, merge, take } from "rxjs";
import { Orientation } from "../../../../../models/Orientation";
import { Action } from "../../../../../utils/Action";
import { SliderHandleData } from "../../../../models/slider/SliderHandleData";
import { SliderHandleType } from "../../../../models/slider/SliderHandleType";
import { SliderLabelPosition } from "../../../../models/slider/SliderLabelPosition";
import { SliderTick } from "../../../../models/slider/SliderTick";
import { RangeSliderTickValueTemplateDirective } from "../../directives/range-slider-tick-value-template.directive";

@Component({
    selector: "mona-range-slider",
    templateUrl: "./range-slider.component.html",
    styleUrls: ["./range-slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RangeSliderComponent),
            multi: true
        }
    ]
})
export class RangeSliderComponent implements AfterViewInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #mouseDown: boolean = false;
    #mouseMove: boolean = false;
    #propagateChange: Action<[number, number]> | null = null;
    public dragging: WritableSignal<boolean> = signal(false);
    public handlePosition: WritableSignal<[number, number]> = signal([0, 0]);
    public handleValue: WritableSignal<[number, number]> = signal([0, 0]);
    public trackSelectionStyleData: Signal<{ size: number; position: number }> = signal({
        position: 0,
        size: 0
    });

    public ticks: SliderTick[] = [];

    @Input()
    public disabled: boolean = false;

    @Input()
    public labelPosition: SliderLabelPosition = "before";

    @Input()
    public labelStep: number = 1;

    @Input()
    public max: number = 10;

    @Input()
    public min: number = 0;

    @Input()
    public orientation: Orientation = "horizontal";

    @ViewChild("primaryHandle")
    public primaryHandle!: ElementRef<HTMLDivElement>;

    @ViewChild("secondaryHandle")
    public secondaryHandle!: ElementRef<HTMLDivElement>;

    @Input()
    public showLabels: boolean = false;

    @Input()
    public showTicks: boolean = false;

    @Input()
    public step: number = 1;

    @Input()
    public tickStep: number = 1;

    @ContentChild(RangeSliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<any>;

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>) {}

    public ngAfterViewInit() {
        this.prepareTicks();
        this.setSubscriptions();
    }

    public ngOnInit(): void {
        this.trackSelectionStyleData = computed(() => {
            return {
                position: Math.min(this.handlePosition()[0], this.handlePosition()[1]),
                size: Math.abs(this.handlePosition()[1] - this.handlePosition()[0])
            };
        });
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

    private handleHandleMove(event: MouseEvent, orientation: Orientation, handleType: SliderHandleType): void {
        if (this.showTicks) {
            const tick = this.findClosestTickElement(event);
            const valueStr = tick.getAttribute("data-value");
            const value = valueStr ? Number(valueStr) : 0;
            const handleData = this.getClosestHandlerDataToMouse(event);
            const handlePosition = handleType === "primary" ? this.handlePosition()[0] : this.handlePosition()[1];
            const newPosition = this.getPositionFromValue(value);
            if (handlePosition !== newPosition) {
                this.setHandlePosition(newPosition, handleType);
                this.setHandleValue(value, handleType);
                this.#propagateChange?.(this.handleValue());
            }
            return;
        }
        const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
        const handlePos =
            orientation === "horizontal" ? event.clientX - containerRect.left : containerRect.bottom - event.clientY;
        const maxPos = orientation === "horizontal" ? containerRect.width : containerRect.height;
        if (handlePos < 0 || handlePos > maxPos) {
            return;
        }
        const value = this.getValueFromPosition(handlePos);
        let currentValue: number;
        if (handleType === "primary") {
            currentValue = this.handleValue()[0];
        } else {
            currentValue = this.handleValue()[1];
        }

        if (!this.showTicks) {
            this.setHandlePosition(handlePos, handleType);
        }
        const position = handleType === "primary" ? this.handlePosition()[0] : this.handlePosition()[1];
        if (currentValue !== value) {
            if (this.showTicks && handlePos !== position) {
                this.setHandlePosition(handlePos, handleType);
            }
            this.setHandleValue(value, handleType);
            if (this.#propagateChange) {
                this.#propagateChange(this.handleValue());
            }
        }
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
        void 0;
    }

    public setHandlePosition(position: number, handleType: SliderHandleType): void {
        this.handlePosition.set(
            handleType === "primary" ? [position, this.handlePosition()[1]] : [this.handlePosition()[0], position]
        );
    }

    public writeValue(obj: [number, number]) {
        if (obj != null) {
            this.handleValue.set([
                this.min >= obj[0] ? this.min : this.max <= obj[0] ? this.max : obj[0],
                this.min >= obj[1] ? this.min : this.max <= obj[1] ? this.max : obj[1]
            ]);
            this.handlePosition.set(
                this.handleValue().map(value => this.getPositionFromValue(value)) as [number, number]
            );
        }
    }

    private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
        const elements = Array.from(
            this.elementRef.nativeElement.querySelectorAll(".mona-range-slider-tick > span")
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

    private getClosestHandlerDataToMouse(event: MouseEvent): SliderHandleData {
        const primaryHandlerRect = this.primaryHandle.nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.secondaryHandle.nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(
            Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2)
        );
        const secondaryDistance = Math.sqrt(
            Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
                Math.pow(secondaryHandlerRect.top - event.clientY, 2)
        );
        return primaryDistance < secondaryDistance
            ? {
                  element: this.primaryHandle.nativeElement,
                  type: "primary"
              }
            : {
                  element: this.secondaryHandle.nativeElement,
                  type: "secondary"
              };
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

    private setHandleValue(value: number, handleType: SliderHandleType): void {
        if (handleType === "primary") {
            this.handleValue.set([value, this.handleValue()[1]]);
        } else {
            this.handleValue.set([this.handleValue()[0], value]);
        }
    }

    private setKeyboardSubscriptions(): void {
        merge(
            fromEvent<KeyboardEvent>(this.primaryHandle.nativeElement, "keydown").pipe(
                map(event => ({ event, type: "primary" }))
            ),
            fromEvent<KeyboardEvent>(this.secondaryHandle.nativeElement, "keydown").pipe(
                map(event => ({ event, type: "secondary" }))
            )
        )
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(
                    ({ event }) =>
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowRight" ||
                        event.key === "ArrowUp" ||
                        event.key === "ArrowDown"
                )
            )
            .subscribe(({ event, type }) => {
                const value = this.handleValue()[type === "primary" ? 0 : 1];
                let newValue: number;
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                    newValue = value - this.step;
                } else {
                    newValue = value + this.step;
                }
                if (newValue < this.min || newValue > this.max) {
                    return;
                }
                this.setHandleValue(newValue, type as SliderHandleType);
                this.setHandlePosition(this.getPositionFromValue(newValue), type as SliderHandleType);
                if (this.#propagateChange) {
                    this.#propagateChange(this.handleValue());
                }
            });
    }

    private setSubscriptions(): void {
        merge(
            fromEvent<MouseEvent>(this.primaryHandle.nativeElement, "mousedown").pipe(
                map(event => ({ event, type: "primary" }))
            ),
            fromEvent<MouseEvent>(this.secondaryHandle.nativeElement, "mousedown").pipe(
                map(event => ({ event, type: "secondary" }))
            )
        )
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(({ event, type }) => {
                this.dragging.set(true);
                this.#mouseDown = true;
                const moveSubscription = fromEvent<MouseEvent>(document, "mousemove").subscribe(event => {
                    if (this.#mouseDown) {
                        this.#mouseMove = true;
                        this.handleHandleMove(event, this.orientation, type as SliderHandleType);
                    }
                });
                fromEvent<MouseEvent>(document, "mouseup")
                    .pipe(delay(1), take(1))
                    .subscribe(() => {
                        this.#mouseDown = false;
                        this.#mouseMove = false;
                        this.dragging.set(false);
                        moveSubscription.unsubscribe();
                    });
            });
        this.setKeyboardSubscriptions();
        this.setTrackClickSubscription();
    }

    private setTrackClickSubscription(): void {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "click")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(() => !this.disabled && !this.#mouseMove),
                map(event => {
                    const handleData = this.getClosestHandlerDataToMouse(event);
                    return { event, handleData };
                })
            )
            .subscribe(({ event, handleData }) => {
                this.handleHandleMove(event, this.orientation, handleData.type);
            });
    }

    // public onHandleKeyDown(event: KeyboardEvent, type: SliderHandlerType): void {
    //     const value = type === "primary" ? this.handlerValue()[0] : this.handlerValue()[1];
    //     if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    //         if (value - this.step < this.min) {
    //             return;
    //         }
    //         this.setHandlerValue(value - this.step, type);
    //     } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    //         if (value + this.step > this.max) {
    //             return;
    //         }
    //         this.setHandlerValue(value + this.step, type);
    //     }
    //     if (!this.dragging()) {
    //         fromEvent(event.target as HTMLElement, "keyup")
    //             .pipe(take(1))
    //             .subscribe(() => {
    //                 this.dragging.set(false);
    //             });
    //         this.dragging.set(true);
    //     }
    // }
    //
    // public onTickClick(event: MouseEvent, tick: SliderTick): void {
    //     const handlerData = this.getClosestHandlerDataToMouse(event);
    //     this.setHandlerValue(tick.value, handlerData.type);
    //     handlerData.element.focus();
    // }
    //
    //

    //
    //
}
