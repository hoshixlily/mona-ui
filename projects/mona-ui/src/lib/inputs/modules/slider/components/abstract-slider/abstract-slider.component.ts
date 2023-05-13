import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    signal,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { fromEvent, Subject, take, takeUntil, timer } from "rxjs";
import { SliderHandlerType } from "../../models/SliderHandlerType";
import { SliderHandlerData } from "../../models/SliderHandlerData";
import { SliderHandlerPositionData } from "../../models/SliderHandlerPositionData";
import { Action } from "../../../../../utils/Action";
import { SliderTick } from "../../models/SliderTick";
import { SliderTrackData } from "../../models/SliderTrackData";
import { SliderLabelPosition } from "../../models/SliderLabelPosition";
import { Orientation } from "../../../../../models/Orientation";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor } from "@angular/forms";

@Component({
    templateUrl: "./abstract-slider.component.html",
    standalone: true,
    imports: [CommonModule]
})
export abstract class AbstractSliderComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor
{
    private readonly componentDestroy$: Subject<void> = new Subject();
    private documentMouseMoveListener: Action | null = null;
    public activeHandlerType: SliderHandlerType | null = null;
    public dragging: WritableSignal<boolean> = signal(false);
    public handlerOnePosition: WritableSignal<number> = signal(0);
    public handlerTwoPosition: WritableSignal<number> = signal(0);
    public handlerValues: [number, number] = [0, 0];
    public initialized: boolean = false;
    public ticks: SliderTick[] = [];
    public trackData: WritableSignal<SliderTrackData> = signal({ position: 0, size: 0 });
    protected abstract propagateChange: Action<any> | null;
    public abstract ranged: boolean;

    @Input()
    public labelPosition: SliderLabelPosition = "after";

    @Input()
    public labelStep: number = 1;

    @Input()
    public max: number = 10;

    @Input()
    public min: number = 0;

    @Input()
    public orientation: Orientation = "horizontal";

    @Input()
    public showTicks: boolean = true;

    @ViewChild("sliderPrimaryHandlerElement", { read: ElementRef })
    private sliderPrimaryHandlerElementRef!: ElementRef<HTMLDivElement>;

    @ViewChild("sliderSecondaryHandlerElement", { read: ElementRef })
    private sliderSecondaryHandlerElementRef!: ElementRef<HTMLDivElement>;

    @ViewChild("sliderTrackElement", { read: ElementRef })
    public sliderTrackElementRef!: ElementRef<HTMLDivElement>;

    @Input()
    public step: number = 1;

    @ViewChild("tickListElement", { read: ElementRef })
    private tickListElementRef!: ElementRef<HTMLDivElement>;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<any>;

    public abstract value: unknown | null;
    public abstract valueChange: EventEmitter<any>;

    protected constructor(
        protected readonly elementRef: ElementRef<HTMLElement>,
        protected readonly renderer: Renderer2,
        protected readonly cdr: ChangeDetectorRef,
        protected readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.setSliderValue(this.handlerValues[0], "primary");
            if (this.ranged) {
                this.setSliderValue(this.handlerValues[1], "secondary");
            }
            this.calculateTrackData();
            this.cdr.detectChanges();
        });
        timer(1000)
            .pipe(take(1))
            .subscribe(() => (this.initialized = true));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const valueChange = changes["value"];
        if (valueChange && !valueChange?.isFirstChange()) {
            let value = this.ranged
                ? (valueChange.currentValue as [number, number])
                : (valueChange.currentValue as number);
            if (value != null) {
                if (this.ranged) {
                    value = value as [number, number];
                    this.setSliderValue(value[0], "primary");
                    this.setSliderValue(value[1], "secondary");
                } else {
                    value = value as number;
                    this.setSliderValue(value, "primary");
                }
            }
        }
    }

    public ngOnDestroy(): void {
        this.documentMouseMoveListener?.();
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.prepareTicks();
        if (this.value == null) {
            return;
        }
    }

    public onHandlerKeyDown(event: KeyboardEvent, handlerType: SliderHandlerType): void {
        const valueIndex = handlerType === "primary" ? 0 : 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            this.setSliderValue(Math.max(this.minValue, this.handlerValues[valueIndex] - this.step), handlerType);
            this.emitValues();
        } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            this.setSliderValue(Math.min(this.maxValue, this.handlerValues[valueIndex] + this.step), handlerType);
            this.emitValues();
        } else if (event.key === "Home") {
            this.setSliderValue(this.minValue, handlerType);
            this.emitValues();
        } else if (event.key === "End") {
            this.setSliderValue(this.maxValue, handlerType);
            this.emitValues();
        }
    }

    public onHandlerMouseDown(event: MouseEvent, handlerType: SliderHandlerType): void {
        event.stopPropagation();
        event.preventDefault();
        if (this.dragging()) {
            return;
        }
        this.activeHandlerType = handlerType;
        this.dragging.set(true);
        this.setEventListeners();
    }

    public onTickClick(event: MouseEvent, tickElement: HTMLSpanElement): void {
        const handlerData = this.getClosestHandlerDataToMouse(event);
        const positionData = this.getHandlerPositionData(tickElement, handlerData.element);
        const value = this.ticks[positionData.tickIndex].value;
        this.setSliderValue(value, handlerData.type);
        this.cdr.detectChanges();
        this.emitValues();
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
        void 0;
    }

    public writeValue(obj: number | [number, number]): void {
        if (obj != null) {
            this.ensureCorrectValueType(obj);
            if (typeof obj === "number") {
                this.handlerValues = [
                    Math.max(this.minValue, Math.min(this.maxValue, obj)),
                    Math.max(this.minValue, Math.min(this.maxValue, obj))
                ];
                this.setSliderValue(this.handlerValues[0], "primary");
            } else {
                this.handlerValues = [
                    Math.max(this.minValue, Math.min(this.maxValue, obj[0])),
                    Math.max(this.minValue, Math.min(this.maxValue, obj[1]))
                ];
                this.setSliderValue(this.handlerValues[0], "primary");
                this.setSliderValue(this.handlerValues[1], "secondary");
            }
        }
    }

    private calculateTrackData(): void {
        if (this.orientation === "horizontal") {
            if (this.ranged) {
                const rectOne = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const rectTwo = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const width =
                    (Math.abs(rectOne.left - rectTwo.left) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                const leftmostRect = rectOne.left < rectTwo.left ? rectOne : rectTwo;
                this.trackData.set({
                    position: leftmostRect.left - this.sliderTrackElementRef.nativeElement.getBoundingClientRect().left,
                    size: width
                });
            } else {
                this.trackData.set({
                    position: 0,
                    size: this.handlerOnePosition() <= 0 ? 0 : this.handlerOnePosition()
                });
            }
        } else {
            if (this.ranged) {
                const rectOne = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const rectTwo = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const height =
                    (Math.abs(rectOne.bottom - rectTwo.bottom) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                const bottommostRect = rectOne.bottom > rectTwo.bottom ? rectOne : rectTwo;
                this.trackData.set({
                    position:
                        this.sliderTrackElementRef.nativeElement.getBoundingClientRect().bottom - bottommostRect.bottom,
                    size: height
                });
            } else {
                this.trackData.set({
                    position: 0,
                    size: this.handlerOnePosition() <= 0 ? 0 : this.handlerOnePosition()
                });
            }
        }
    }

    protected ensureCorrectValueType(value: number | [number, number] | null | undefined): void {
        if (value == null) {
            return;
        }
        if (this.ranged && typeof value === "number") {
            throw new Error("Ranged slider requires an array of values");
        } else if (!this.ranged && typeof value !== "number") {
            throw new Error("Non-ranged slider requires a single value");
        }
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

    private getClosestHandlerDataToMouse(event: MouseEvent): SliderHandlerData {
        if (!this.ranged) {
            return {
                type: "primary",
                element: this.sliderPrimaryHandlerElementRef.nativeElement
            };
        }
        const primaryHandlerRect = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(
            Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2)
        );
        const secondaryDistance = Math.sqrt(
            Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
                Math.pow(secondaryHandlerRect.top - event.clientY, 2)
        );
        return primaryDistance < secondaryDistance
            ? {
                  element: this.sliderPrimaryHandlerElementRef.nativeElement,
                  type: "primary"
              }
            : {
                  element: this.sliderSecondaryHandlerElementRef.nativeElement,
                  type: "secondary"
              };
    }

    private getHandlerPositionData(
        tickElement: HTMLSpanElement,
        sliderHandlerElement: HTMLDivElement
    ): SliderHandlerPositionData {
        const rect = tickElement.getBoundingClientRect();
        const containerRect = this.sliderTrackElementRef.nativeElement.getBoundingClientRect();
        const handlerRect = sliderHandlerElement.getBoundingClientRect();
        const parentElement = tickElement.parentNode;
        const tickElements =
            this.orientation === "horizontal"
                ? Array.from(parentElement?.children ?? [])
                : Array.from(parentElement?.children ?? []).reverse();
        const tickElementIndex = tickElements.indexOf(tickElement);
        const tickIndex = Math.ceil(tickElementIndex / 2);
        let position: number;
        if (this.orientation === "horizontal") {
            if (tickElementIndex % 2 !== 0) {
                position = ((rect.right - containerRect.left - handlerRect.width / 2) * 100.0) / containerRect.width;
            } else {
                const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
                if (siblingRect) {
                    position =
                        ((siblingRect.right - containerRect.left - (2 * handlerRect.width) / 2) * 100.0) /
                        containerRect.width;
                } else {
                    position = (((-1 * handlerRect.width) / 2) * 100.0) / containerRect.width;
                }
            }
            return { position, tickIndex };
        } else {
            if (tickElementIndex % 2 !== 0) {
                position = ((rect.bottom - containerRect.top - handlerRect.height / 2) * 100.0) / containerRect.height;
            } else {
                const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
                if (siblingRect) {
                    position =
                        ((siblingRect.bottom - containerRect.top - (2 * handlerRect.height) / 2) * 100.0) /
                        containerRect.height;
                } else {
                    position = (((-1 * handlerRect.height) / 2) * 100.0) / containerRect.height;
                }
            }
            return { position, tickIndex };
        }
    }

    private prepareTicks(): void {
        let index = 0;
        let value = this.min;
        while (value < this.max) {
            this.ticks.push({ index, value });
            value += this.step;
            index++;
        }
        this.ticks.push({ index, value: Math.min(value + this.step, this.max) });
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(document, "mousemove", (event: MouseEvent) => {
                if (!this.dragging()) {
                    return;
                }
                const tickElement = this.findClosestTickElement(event);
                const positionData = this.getHandlerPositionData(
                    tickElement.parentElement as HTMLSpanElement,
                    this.activeHandlerType === "primary"
                        ? this.sliderPrimaryHandlerElementRef.nativeElement
                        : this.sliderSecondaryHandlerElementRef.nativeElement
                );
                if (this.activeHandlerType === "primary" && positionData.position !== this.handlerOnePosition()) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[0] !== value) {
                            this.setSliderValue(value, "primary");
                            this.emitValues();
                        }
                    });
                } else if (
                    this.activeHandlerType === "secondary" &&
                    positionData.position !== this.handlerTwoPosition()
                ) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[1] !== value) {
                            this.setSliderValue(value, "secondary");
                            this.emitValues();
                        }
                    });
                }
            });
            const sub = fromEvent(document, "mouseup")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(() => {
                    if (!this.dragging()) {
                        return;
                    }
                    this.zone.run(() => {
                        this.dragging.set(false);
                        this.documentMouseMoveListener?.();
                        sub.unsubscribe();
                    });
                });
        });
    }

    private setSliderValue(value: number, handlerType: SliderHandlerType = "primary"): void {
        const sliderValue = Math.max(this.minValue, Math.min(this.maxValue, value));
        if (this.orientation === "horizontal") {
            if (handlerType === "primary") {
                const position =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                    ((this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                        this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                this.handlerOnePosition.set(position);
                this.handlerValues[0] = sliderValue;
            } else {
                const position =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                    ((this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                        this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                this.handlerTwoPosition.set(position);
                this.handlerValues[1] = sliderValue;
            }
        } else {
            if (handlerType === "primary") {
                const position =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                    ((this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect().height / 2) * 100.0) /
                        this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                this.handlerOnePosition.set(position);
                this.handlerValues[0] = sliderValue;
            } else {
                const position =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                    ((this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect().height / 2) * 100.0) /
                        this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                this.handlerTwoPosition.set(position);
                this.handlerValues[1] = sliderValue;
            }
        }
        window.setTimeout(() => {
            this.calculateTrackData();
        });
    }

    protected get maxValue(): number {
        return this.ticks[this.ticks.length - 1].value;
    }

    protected get minValue(): number {
        return this.ticks[0].value;
    }

    protected abstract emitValues(): void;
}
