import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import { Orientation } from "../../../../../models/Orientation";
import { SliderLabelPosition } from "../../../../models/slider/SliderLabelPosition";
import { SliderTick } from "../../../../models/slider/SliderTick";
import { SliderHandlerData } from "../../../../models/slider/SliderHandlerData";
import { SliderHandlerType } from "../../../../models/slider/SliderHandlerType";
import {
    delay,
    distinctUntilChanged,
    filter,
    fromEvent,
    map,
    merge,
    mergeWith,
    startWith,
    take,
    takeUntil,
    tap
} from "rxjs";
import { RangeSliderTickValueTemplateDirective } from "../../directives/range-slider-tick-value-template.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
    public trackSelectionPositions: Signal<{ size: number; position: number }> = signal({
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
    public showTicks: boolean = false;

    @Input()
    public step: number = 1;

    @ContentChild(RangeSliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<any>;

    public constructor(
        private readonly elementRef: ElementRef<HTMLDivElement>,
        private readonly cdr: ChangeDetectorRef
    ) {}

    public ngAfterViewInit() {
        this.setSubscriptions();
    }

    public ngOnInit(): void {
        // this.prepareTicks();
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
            return (value / this.max) * containerRect.width;
        } else {
            if (value === this.min) {
                return 0;
            }
            if (value === this.max) {
                return containerRect.height;
            }
            return (value / this.max) * containerRect.height;
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

    private handleHandleMove(event: MouseEvent, orientation: Orientation, handleType: SliderHandlerType): void {
        if (this.showTicks) {
            // TODO: implement
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

    public setHandlePosition(position: number, handleType: SliderHandlerType): void {
        this.handlePosition.set(
            handleType === "primary" ? [position, this.handlePosition()[1]] : [this.handlePosition()[0], position]
        );
    }

    public writeValue(obj: [number, number]) {
        if (obj != null) {
            this.handleValue.set(obj);
            this.handlePosition.set(obj.map(value => this.getPositionFromValue(value)) as [number, number]);
        }
    }

    private setHandleValue(value: number, handleType: SliderHandlerType): void {
        if (handleType === "primary") {
            this.handleValue.set([value, this.handleValue()[1]]);
        } else {
            this.handleValue.set([this.handleValue()[0], value]);
        }
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
                        this.handleHandleMove(event, this.orientation, type as SliderHandlerType);
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
    // public onHandlerMouseDown(event: MouseEvent, type: SliderHandlerType): void {
    //     const moveSubscription = fromEvent(document, "mousemove")
    //         .pipe(
    //             tap(() => this.dragging.set(true)),
    //             map((moveEvent: Event) => {
    //                 const tickElement = this.findClosestTickElement(moveEvent as MouseEvent);
    //                 return Number(tickElement.getAttribute("data-value"));
    //             }),
    //             filter((value: number) =>
    //                 type === "primary" ? value !== this.handlerValue()[0] : value !== this.handlerValue()[1]
    //             ),
    //             distinctUntilChanged()
    //         )
    //         .subscribe((value: number) => {
    //             this.setHandlerValue(value, type);
    //         });
    //     fromEvent(document, "mouseup")
    //         .pipe(take(1))
    //         .subscribe(() => {
    //             this.dragging.set(false);
    //             moveSubscription.unsubscribe();
    //         });
    // }
    //
    // public onTickClick(event: MouseEvent, tick: SliderTick): void {
    //     const handlerData = this.getClosestHandlerDataToMouse(event);
    //     this.setHandlerValue(tick.value, handlerData.type);
    //     handlerData.element.focus();
    // }
    //
    // public registerOnChange(fn: any): void {
    //     this.#propagateChange = fn;
    // }
    //
    // public registerOnTouched(fn: any): void {
    //     void 0;
    // }
    //
    // public writeValue(obj: [number, number]) {
    //     if (obj !== undefined) {
    //         this.handlerValue.set(obj);
    //     }
    // }
    //
    // private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
    //     const elements = Array.from(
    //         this.elementRef.nativeElement.querySelectorAll(".mona-range-slider-tick > span")
    //     ) as HTMLSpanElement[];
    //     let maxDistance = Number.MAX_VALUE;
    //     let index = 0;
    //     for (const [ex, element] of elements.entries()) {
    //         const rect = element.getBoundingClientRect();
    //         const distance = Math.sqrt(Math.pow(rect.left - event.clientX, 2) + Math.pow(rect.top - event.clientY, 2));
    //         if (distance < maxDistance) {
    //             maxDistance = distance;
    //             index = ex;
    //         }
    //     }
    //     return elements[index];
    // }
    //
    // private getClosestHandlerDataToMouse(event: MouseEvent): SliderHandlerData {
    //     const primaryHandlerRect = this.primaryHandlerRef.nativeElement.getBoundingClientRect();
    //     const secondaryHandlerRect = this.secondaryHandlerRef.nativeElement.getBoundingClientRect();
    //     const primaryDistance = Math.sqrt(
    //         Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2)
    //     );
    //     const secondaryDistance = Math.sqrt(
    //         Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
    //             Math.pow(secondaryHandlerRect.top - event.clientY, 2)
    //     );
    //     return primaryDistance < secondaryDistance
    //         ? {
    //               element: this.primaryHandlerRef.nativeElement,
    //               type: "primary"
    //           }
    //         : {
    //               element: this.secondaryHandlerRef.nativeElement,
    //               type: "secondary"
    //           };
    // }
    //
    // private prepareTicks(): void {
    //     let index = 0;
    //     let value = this.min;
    //     while (value < this.max) {
    //         this.ticks.push({ index, value });
    //         value += this.step;
    //         index++;
    //     }
    //     this.ticks.push({ index, value: Math.min(value + this.step, this.max) });
    //     if (this.orientation === "vertical") {
    //         this.ticks.reverse();
    //     }
    // }
    //
    // private setHandlerPositionsSignal(): void {
    //     this.handlerPosition = computed(() => {
    //         const element = this.elementRef.nativeElement;
    //         const rect = element.getBoundingClientRect();
    //         const primaryHandlerRect = this.primaryHandlerRef.nativeElement.getBoundingClientRect();
    //         const secondaryHandlerRect = this.secondaryHandlerRef.nativeElement.getBoundingClientRect();
    //         const distance = this.orientation === "horizontal" ? rect.right - rect.left : rect.bottom - rect.top;
    //
    //         if (!this.handlerValue()) {
    //             return [0, 0];
    //         }
    //         const primaryValue = Math.max(this.min, Math.min(this.handlerValue()[0], this.max));
    //         const secondaryValue = Math.max(this.min, Math.min(this.handlerValue()[1], this.max));
    //         const primaryPercentage = (primaryValue - this.min) / (this.max - this.min);
    //         const secondaryPercentage = (secondaryValue - this.min) / (this.max - this.min);
    //         const primaryOffset =
    //             this.orientation === "horizontal" ? primaryHandlerRect.width / 2 : primaryHandlerRect.height / 2;
    //         const secondaryOffset =
    //             this.orientation === "horizontal" ? secondaryHandlerRect.width / 2 : secondaryHandlerRect.height / 2;
    //         const positions: [number, number] = [
    //             Math.max(distance * primaryPercentage - primaryOffset, -primaryOffset),
    //             Math.max(distance * secondaryPercentage - secondaryOffset, -secondaryOffset)
    //         ];
    //         return positions;
    //     });
    // }
    //
    // private setHandlerValue(value: number, type: SliderHandlerType): void {
    //     if (type === "primary") {
    //         if (value === this.handlerValue()[0]) {
    //             return;
    //         }
    //         this.handlerValue.update(currentValue => [value, currentValue[1]]);
    //     } else {
    //         if (value === this.handlerValue()[1]) {
    //             return;
    //         }
    //         this.handlerValue.update(currentValue => [currentValue[0], value]);
    //     }
    //     this.#propagateChange?.(this.handlerValue());
    // }
    //
    // private setTrackSelectionSignal(): void {
    //     this.trackSelectionPositions = computed(() => {
    //         return {
    //             position: Math.min(this.handlerPosition()[0], this.handlerPosition()[1]),
    //             size: Math.abs(this.handlerPosition()[1] - this.handlerPosition()[0])
    //         };
    //     });
    // }
}
