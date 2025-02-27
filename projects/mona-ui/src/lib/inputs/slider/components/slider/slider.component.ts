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
    NgZone,
    Signal,
    signal,
    TemplateRef,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { filter, fromEvent, mergeMap, take, takeUntil, tap } from "rxjs";
import { Action } from "../../../../utils/Action";
import { SliderLabelPosition } from "../../../models/SliderLabelPosition";
import { SliderTick } from "../../../models/SliderTick";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";

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
    ],
    imports: [NgClass, NgTemplateOutlet],
    host: {
        "[class.mona-slider]": "true",
        "[class.mona-slider-horizontal]": "orientation() === 'horizontal'",
        "[class.mona-slider-vertical]": "orientation() === 'vertical'",
        "[class.mona-disabled]": "disabled()"
    }
})
export class SliderComponent implements AfterViewInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    readonly #zone: NgZone = inject(NgZone);
    #propagateChange: Action<number> | null = null;
    protected readonly dragging = signal(false);
    protected readonly handlePosition = signal(0);
    protected readonly handleValue = signal(0);
    protected readonly sliderHandle: Signal<ElementRef<HTMLDivElement>> = viewChild.required("sliderHandle");
    protected readonly tickValueTemplate = contentChild(SliderTickValueTemplateDirective, { read: TemplateRef });
    protected readonly ticks = computed(() => {
        const min = this.min();
        const max = this.max();
        const tickList: SliderTick[] = [];
        let value = min;
        let index = 0;
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

    public disabled = input(false);
    public labelPosition = input<SliderLabelPosition>("after");
    public labelStep = input(1);
    public max = input(10);
    public min = input(0);
    public orientation = input<"horizontal" | "vertical">("horizontal");
    public showLabels = input(false);
    public showTicks = input(false);
    public step = input(1);
    public tickStep = input(1);

    public ngAfterViewInit(): void {
        this.setSubscription();
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(obj: number): void {
        if (obj != null) {
            const value = Math.max(this.min(), Math.min(obj, this.max()));
            const position = this.getPositionFromValue(value);
            this.handleValue.set(value);
            this.handlePosition.set(position);
        }
    }

    private getPositionFromValue(value: number): number {
        if (value === this.min()) {
            return 0;
        }
        if (value === this.max()) {
            return 100;
        }
        return ((value - this.min()) / (this.max() - this.min())) * 100;
    }

    private getValueFromPosition(position: number): number {
        const value = position / 100;
        return Math.max(this.min(), Math.min(this.max(), Math.round(value * this.max())));
    }

    private handleHandleMove(event: MouseEvent, direction: "horizontal" | "vertical"): void {
        if (this.showTicks()) {
            const tick = this.findClosestTickElement(event);
            const valueStr = tick.getAttribute("data-value");
            const value = valueStr ? Number(valueStr) : 0;
            const position = this.getPositionFromValue(value);
            if (position !== this.handlePosition()) {
                this.#zone.run(() => {
                    this.handlePosition.set(position);
                    this.handleValue.set(value);
                    this.#propagateChange?.(value);
                });
            }
            return;
        }

        const containerRect = this.#hostElementRef.nativeElement.getBoundingClientRect();
        let handlePos =
            direction === "horizontal" ? event.clientX - containerRect.left : event.clientY - containerRect.top;
        let normalizedHandlePos = 0;
        if (direction === "horizontal") {
            normalizedHandlePos = Math.max(0, Math.min((handlePos / containerRect.width) * 100, 100));
        } else {
            normalizedHandlePos = Math.max(0, Math.min(100 - (handlePos / containerRect.height) * 100, 100));
        }

        const maxPos = direction === "horizontal" ? containerRect.width : containerRect.height;
        if (
            normalizedHandlePos >= 0 &&
            normalizedHandlePos <= maxPos &&
            normalizedHandlePos !== this.handlePosition()
        ) {
            const value = this.getValueFromPosition(normalizedHandlePos);
            if (!this.showTicks()) {
                this.#zone.run(() => {
                    this.handlePosition.set(normalizedHandlePos);
                });
            }
            if (value !== this.handleValue()) {
                this.#zone.run(() => {
                    if (this.showTicks() && this.handlePosition() !== normalizedHandlePos) {
                        this.handlePosition.set(normalizedHandlePos);
                    }
                    this.handleValue.set(value);
                    this.#propagateChange?.(value);
                });
            }
        }
    }

    private setSubscription(): void {
        this.#zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.sliderHandle().nativeElement, "mousedown")
                .pipe(
                    takeUntilDestroyed(this.#destroyRef),
                    filter(() => !this.disabled()),
                    mergeMap(() => {
                        this.dragging.set(true);
                        return fromEvent<MouseEvent>(document, "mousemove").pipe(
                            tap((event: MouseEvent) => this.handleHandleMove(event, this.orientation())),
                            takeUntil(
                                fromEvent<MouseEvent>(document, "mouseup").pipe(
                                    take(1),
                                    tap(() => this.#zone.run(() => this.dragging.set(false)))
                                )
                            )
                        );
                    })
                )
                .subscribe();

            fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
                .pipe(
                    takeUntilDestroyed(this.#destroyRef),
                    tap(() => this.dragging.set(false)),
                    filter(() => !this.disabled())
                )
                .subscribe((event: MouseEvent) => {
                    this.handleHandleMove(event, this.orientation());
                });

            fromEvent<KeyboardEvent>(this.sliderHandle().nativeElement, "keydown")
                .pipe(
                    filter(
                        (event: KeyboardEvent) =>
                            event.key === "ArrowLeft" ||
                            event.key === "ArrowRight" ||
                            event.key === "ArrowUp" ||
                            (event.key === "ArrowDown" && !this.disabled())
                    ),
                    tap((event: KeyboardEvent) => {
                        event.stopPropagation();
                        this.#zone.run(() => {
                            this.dragging.set(true);
                        });
                        const value = this.handleValue();
                        const step =
                            event.key === "ArrowLeft" || event.key === "ArrowDown" ? -this.step() : this.step();
                        const newValue = Math.max(this.min(), Math.min(this.max(), value + step));
                        this.#zone.run(() => {
                            this.handleValue.set(newValue);
                            this.handlePosition.set(this.getPositionFromValue(newValue));
                            this.#propagateChange?.(newValue);
                        });
                    }),
                    takeUntilDestroyed(this.#destroyRef)
                )
                .subscribe();
        });
    }

    private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
        const elements = Array.from(this.#hostElementRef.nativeElement.querySelectorAll(".mona-slider-tick > span"));
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
}
