import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    InputSignal,
    NgZone,
    Signal,
    signal,
    TemplateRef,
    viewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { filter, fromEvent, map, merge, switchMap, take, takeUntil, tap } from "rxjs";
import { Orientation } from "../../../../models/Orientation";
import { Action } from "../../../../utils/Action";
import { SliderHandleData } from "../../../models/SliderHandleData";
import { SliderHandleType } from "../../../models/SliderHandleType";
import { SliderLabelPosition } from "../../../models/SliderLabelPosition";
import { SliderTick } from "../../../models/SliderTick";
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
    ],
    standalone: true,
    imports: [NgClass, NgTemplateOutlet],
    host: {
        "[class.mona-range-slider]": "true",
        "[class.mona-range-slider-horizontal]": "orientation() === 'horizontal'",
        "[class.mona-range-slider-vertical]": "orientation() === 'vertical'",
        "[class.mona-disabled]": "disabled()"
    }
})
export class RangeSliderComponent implements AfterViewInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #zone: NgZone = inject(NgZone);
    #propagateChange: Action<[number, number]> | null = null;
    protected readonly dragging: WritableSignal<boolean> = signal(false);
    protected readonly handlePosition: WritableSignal<[number, number]> = signal([0, 0]);
    protected readonly handleValue: WritableSignal<[number, number]> = signal([0, 0]);
    protected readonly primaryHandle: Signal<ElementRef<HTMLDivElement>> = viewChild.required("primaryHandle");
    protected readonly secondaryHandle: Signal<ElementRef<HTMLDivElement>> = viewChild.required("secondaryHandle");
    protected readonly tickValueTemplate = contentChild(RangeSliderTickValueTemplateDirective, { read: TemplateRef });
    protected readonly trackSelectionStyleData: Signal<{ size: number; position: number }> = computed(() => {
        const handlePosition = this.handlePosition();
        return {
            position: Math.min(handlePosition[0], handlePosition[1]),
            size: Math.abs(handlePosition[1] - handlePosition[0])
        };
    });

    public ticks: Signal<SliderTick[]> = computed(() => {
        const min = this.min();
        const max = this.max();
        let index = 0;
        let value = min;
        const tickList: SliderTick[] = [];
        while (value < max) {
            tickList.push({ index, value });
            value += this.step();
            index++;
        }
        tickList.push({ index, value: Math.min(value + this.step(), max) });
        if (this.orientation() === "vertical") {
            tickList.reverse();
        }
        return tickList;
    });

    public disabled: InputSignal<boolean> = input(false);
    public labelPosition: InputSignal<SliderLabelPosition> = input<SliderLabelPosition>("before");
    public labelStep: InputSignal<number> = input(1);
    public max: InputSignal<number> = input(10);
    public min: InputSignal<number> = input(0);
    public orientation: InputSignal<Orientation> = input<Orientation>("horizontal");
    public showLabels: InputSignal<boolean> = input(false);
    public showTicks: InputSignal<boolean> = input(false);
    public step: InputSignal<number> = input(1);
    public tickStep: InputSignal<number> = input(1);

    public ngAfterViewInit() {
        this.setSubscriptions();
    }

    private getPositionFromValue(value: number): number {
        if (value === this.min()) {
            return 0;
        }
        if (value === this.max()) {
            return 100;
        }
        return ((value - this.min()) / (this.max() - this.min())) * 100.0;
    }

    private getValueFromPosition(position: number): number {
        const value = position / 100.0;
        return Math.max(this.min(), Math.min(this.max(), Math.round(value * this.max())));
    }

    private handleHandleMove(event: MouseEvent, orientation: Orientation, handleType: SliderHandleType): void {
        if (this.showTicks()) {
            const tick = this.findClosestTickElement(event);
            const valueStr = tick.getAttribute("data-value");
            const value = valueStr ? Number(valueStr) : 0;
            const handlePosition = handleType === "primary" ? this.handlePosition()[0] : this.handlePosition()[1];
            const newPosition = this.getPositionFromValue(value);
            if (handlePosition !== newPosition) {
                this.#zone.run(() => {
                    this.setHandlePosition(newPosition, handleType);
                    this.setHandleValue(value, handleType);
                    this.#propagateChange?.(this.handleValue());
                });
            }
            return;
        }
        const containerRect = this.#hostElementRef.nativeElement.getBoundingClientRect();
        const handlePos =
            orientation === "horizontal" ? event.clientX - containerRect.left : containerRect.bottom - event.clientY;
        let normalizedHandlePos = 0;
        if (orientation === "horizontal") {
            normalizedHandlePos = Math.max(0, Math.min((handlePos / containerRect.width) * 100, 100));
        } else {
            normalizedHandlePos = Math.max(0, Math.min((handlePos / containerRect.height) * 100, 100));
        }
        const maxPos = orientation === "horizontal" ? containerRect.width : containerRect.height;
        if (normalizedHandlePos < 0 || normalizedHandlePos > maxPos) {
            return;
        }
        const value = this.getValueFromPosition(normalizedHandlePos);
        let currentValue: number;
        if (handleType === "primary") {
            currentValue = this.handleValue()[0];
        } else {
            currentValue = this.handleValue()[1];
        }

        if (!this.showTicks()) {
            this.#zone.run(() => {
                this.setHandlePosition(normalizedHandlePos, handleType);
            });
        }
        const position = handleType === "primary" ? this.handlePosition()[0] : this.handlePosition()[1];
        if (currentValue !== value) {
            this.#zone.run(() => {
                if (this.showTicks() && normalizedHandlePos !== position) {
                    this.setHandlePosition(normalizedHandlePos, handleType);
                }
                this.setHandleValue(value, handleType);
                if (this.#propagateChange) {
                    this.#propagateChange(this.handleValue());
                }
            });
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
            if (this.max() <= obj[0]) {
                this.handleValue.set([
                    this.min() >= obj[0] ? this.min() : this.max(),
                    this.min() >= obj[1] ? this.min() : this.max() <= obj[1] ? this.max() : obj[1]
                ]);
            } else {
                this.handleValue.set([
                    this.min() >= obj[0] ? this.min() : obj[0],
                    this.min() >= obj[1] ? this.min() : this.max() <= obj[1] ? this.max() : obj[1]
                ]);
            }
            this.handlePosition.set(
                this.handleValue().map(value => this.getPositionFromValue(value)) as [number, number]
            );
        }
    }

    private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
        const elements = Array.from(
            this.#hostElementRef.nativeElement.querySelectorAll(".mona-range-slider-tick > span")
        );
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
        return elements[index] as HTMLSpanElement;
    }

    private getClosestHandlerDataToMouse(event: MouseEvent): SliderHandleData {
        const primaryHandlerRect = this.primaryHandle().nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.secondaryHandle().nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(
            Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2)
        );
        const secondaryDistance = Math.sqrt(
            Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
                Math.pow(secondaryHandlerRect.top - event.clientY, 2)
        );
        return primaryDistance < secondaryDistance
            ? {
                  element: this.primaryHandle().nativeElement,
                  type: "primary"
              }
            : {
                  element: this.secondaryHandle().nativeElement,
                  type: "secondary"
              };
    }

    private setHandleValue(value: number, handleType: SliderHandleType): void {
        if (handleType === "primary") {
            this.handleValue.set([value, this.handleValue()[1]]);
        } else {
            this.handleValue.set([this.handleValue()[0], value]);
        }
    }

    private setKeyboardSubscriptions(): void {
        this.#zone.runOutsideAngular(() => {
            merge(
                fromEvent<KeyboardEvent>(this.primaryHandle().nativeElement, "keydown").pipe(
                    map(event => ({ event, type: "primary" }))
                ),
                fromEvent<KeyboardEvent>(this.secondaryHandle().nativeElement, "keydown").pipe(
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
                        newValue = value - this.step();
                    } else {
                        newValue = value + this.step();
                    }
                    if (newValue < this.min() || newValue > this.max()) {
                        return;
                    }
                    this.#zone.run(() => {
                        this.setHandleValue(newValue, type as SliderHandleType);
                        this.setHandlePosition(this.getPositionFromValue(newValue), type as SliderHandleType);
                        if (this.#propagateChange) {
                            this.#propagateChange(this.handleValue());
                        }
                    });
                });
        });
    }

    private setSubscriptions(): void {
        this.#zone.runOutsideAngular(() => {
            merge(
                fromEvent<MouseEvent>(this.primaryHandle().nativeElement, "mousedown").pipe(
                    map(event => ({ event, type: "primary" }))
                ),
                fromEvent<MouseEvent>(this.secondaryHandle().nativeElement, "mousedown").pipe(
                    map(event => ({ event, type: "secondary" }))
                )
            )
                .pipe(
                    switchMap(({ type }) => {
                        this.#zone.run(() => this.dragging.set(true)); // Ensure Angular knows dragging started
                        return fromEvent<MouseEvent>(document, "mousemove").pipe(
                            tap(moveEvent =>
                                this.handleHandleMove(moveEvent, this.orientation(), type as SliderHandleType)
                            ),
                            takeUntil(
                                fromEvent<MouseEvent>(document, "mouseup").pipe(
                                    tap(() => this.#zone.run(() => this.dragging.set(false))),
                                    take(1)
                                )
                            )
                        );
                    }),
                    takeUntilDestroyed(this.#destroyRef)
                )
                .subscribe();
        });
        this.setKeyboardSubscriptions();
        this.setTrackClickSubscription();
    }

    private setTrackClickSubscription(): void {
        this.#zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
                .pipe(
                    takeUntilDestroyed(this.#destroyRef),
                    filter(() => !this.disabled()),
                    map(event => {
                        const handleData = this.getClosestHandlerDataToMouse(event);
                        return { event, handleData };
                    })
                )
                .subscribe(({ event, handleData }) => {
                    this.handleHandleMove(event, this.orientation(), handleData.type);
                });
        });
    }
}
