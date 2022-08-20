import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { fromEvent, Subject, take, takeUntil, timer } from "rxjs";
import { Action } from "../../../../../utils/Action";
import { SliderTick } from "../../models/SliderTick";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { SliderHandlerPositionData } from "../../models/SliderHandlerPositionData";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

type HandlerType = "primary" | "secondary";

interface HandlerData {
    element: HTMLDivElement;
    type: HandlerType;
}

interface TrackData {
    left: number;
    width: number;
}

@Component({
    selector: "mona-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true
        }
    ]
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
    private readonly componentDestroy$: Subject<void> = new Subject();
    private documentMouseMoveListener: Action | null = null;
    private previousUserSelect: string = "";
    private propagateChange: Action<number | [number, number]> | null = null;
    public activeHandlerType: HandlerType | null = null;
    public dragging: boolean = false;
    public handlerLeftPosition: number = 0;
    public handlerTwoLeftPosition: number = 0;
    public handlerValues: [number, number] = [0, 0];
    public initialized: boolean = false;
    public ticks: SliderTick[] = [];
    public trackData: TrackData = { left: 0, width: 0 };

    @Input()
    public labelStep: number = 1;

    @Input()
    public max: number = 10;

    @Input()
    public min: number = 0;

    @Input()
    public ranged: boolean = false;

    @Input()
    public showTicks: boolean = true;

    @ViewChild("sliderHandlerElement", { read: ElementRef })
    private sliderHandlerElement!: ElementRef<HTMLDivElement>;

    @ViewChild("sliderHandlerElement2", { read: ElementRef })
    private sliderHandlerElement2!: ElementRef<HTMLDivElement>;

    @ViewChild("sliderTrackElement", { read: ElementRef })
    public sliderTrackElementRef!: ElementRef<HTMLDivElement>;

    @Input()
    public step: number = 1;

    @ViewChild("tickListElement", { read: ElementRef })
    private tickListElementRef!: ElementRef<HTMLDivElement>;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<void>;

    @Input()
    public value: number | [number, number] | null = null;

    @Output()
    public valueChange: EventEmitter<number | [number, number]> = new EventEmitter<number | [number, number]>();

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        private readonly cdr: ChangeDetectorRef,
        private readonly zone: NgZone
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
        this.ensureCorrectValueType(this.value);
        if (typeof this.value === "number") {
            this.handlerValues = [
                Math.max(this.minValue, Math.min(this.maxValue, this.value)),
                Math.max(this.minValue, Math.min(this.maxValue, this.value))
            ];
        } else {
            this.handlerValues = [
                Math.max(this.minValue, Math.min(this.maxValue, this.value[0])),
                Math.max(this.minValue, Math.min(this.maxValue, this.value[1]))
            ];
        }
    }

    public onHandlerKeyDown(event: KeyboardEvent, handlerType: HandlerType): void {
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

    public onHandlerMouseDown(handlerType: HandlerType): void {
        if (this.dragging) {
            return;
        }
        this.activeHandlerType = handlerType;
        this.dragging = true;
        this.previousUserSelect = document.documentElement.style.userSelect;
        document.documentElement.style.userSelect = "none";
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
        if (this.ranged) {
            const rectOne = this.sliderHandlerElement.nativeElement.getBoundingClientRect();
            const rectTwo = this.sliderHandlerElement2.nativeElement.getBoundingClientRect();
            const width =
                (Math.abs(rectOne.left - rectTwo.left) * 100.0) /
                this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
            const firstRect = rectOne.left < rectTwo.left ? rectOne : rectTwo;
            this.trackData = {
                left: firstRect.left - this.sliderTrackElementRef.nativeElement.getBoundingClientRect().left,
                width
            };
        } else {
            this.trackData = {
                left: 0,
                width: this.handlerLeftPosition <= 0 ? 0 : this.handlerLeftPosition
            };
        }
    }

    private emitValues(): void {
        if (this.ranged) {
            this.value = [this.handlerValues[0], this.handlerValues[1]];
            this.valueChange.emit([this.handlerValues[0], this.handlerValues[1]]);
            this.propagateChange?.([this.handlerValues[0], this.handlerValues[1]]);
        } else {
            this.value = this.handlerValues[0];
            this.valueChange.emit(this.handlerValues[0]);
            this.propagateChange?.(this.handlerValues[0]);
        }
    }

    private ensureCorrectValueType(value: number | [number, number] | null | undefined): void {
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

    private getClosestHandlerDataToMouse(event: MouseEvent): HandlerData {
        if (!this.ranged) {
            return {
                type: "primary",
                element: this.sliderHandlerElement.nativeElement
            };
        }
        const primaryHandlerRect = this.sliderHandlerElement.nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.sliderHandlerElement2.nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(
            Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2)
        );
        const secondaryDistance = Math.sqrt(
            Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
                Math.pow(secondaryHandlerRect.top - event.clientY, 2)
        );
        return primaryDistance < secondaryDistance
            ? {
                  element: this.sliderHandlerElement.nativeElement,
                  type: "primary"
              }
            : {
                  element: this.sliderHandlerElement2.nativeElement,
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
        const tickElementIndex = Array.from(parentElement?.children ?? []).indexOf(tickElement);

        const tickIndex = Math.ceil(tickElementIndex / 2);

        let position: number;
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
                if (!this.dragging) {
                    return;
                }
                const tickElement = this.findClosestTickElement(event);
                const positionData = this.getHandlerPositionData(
                    tickElement.parentElement as HTMLSpanElement,
                    this.activeHandlerType === "primary"
                        ? this.sliderHandlerElement.nativeElement
                        : this.sliderHandlerElement2.nativeElement
                );
                if (this.activeHandlerType === "primary" && positionData.position !== this.handlerLeftPosition) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[0] !== value) {
                            this.setSliderValue(value, "primary");
                            this.emitValues();
                        }
                    });
                } else if (
                    this.activeHandlerType === "secondary" &&
                    positionData.position !== this.handlerTwoLeftPosition
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
                    if (!this.dragging) {
                        return;
                    }
                    this.zone.run(() => {
                        this.dragging = false;
                        if (this.previousUserSelect) {
                            document.documentElement.style.userSelect = this.previousUserSelect;
                        } else {
                            document.documentElement.style.removeProperty("user-select");
                        }
                        this.documentMouseMoveListener?.();
                        sub.unsubscribe();
                    });
                });
        });
    }

    private setSliderValue(value: number, handlerType: HandlerType = "primary"): void {
        const sliderValue = Math.max(this.minValue, Math.min(this.maxValue, value));
        if (handlerType === "primary") {
            this.handlerLeftPosition =
                ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                ((this.sliderHandlerElement.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
            this.handlerValues[0] = sliderValue;
        } else {
            this.handlerTwoLeftPosition =
                ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                ((this.sliderHandlerElement2.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
            this.handlerValues[1] = sliderValue;
        }
        window.setTimeout(() => {
            this.calculateTrackData();
        });
    }

    private get maxValue(): number {
        return this.ticks[this.ticks.length - 1].value;
    }

    private get minValue(): number {
        return this.ticks[0].value;
    }
}
