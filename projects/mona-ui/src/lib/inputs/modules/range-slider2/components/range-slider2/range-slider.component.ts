import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { SliderLabelPosition } from "../../../../models/slider/SliderLabelPosition";
import { SliderTickValueTemplateDirective } from "../../../slider2/directives/slider-tick-value-template.directive";
import { SliderTick } from "../../../../models/slider/SliderTick";
import { SliderHandlerData } from "../../../../models/slider/SliderHandlerData";
import { SliderHandlerType } from "../../../../models/slider/SliderHandlerType";
import { distinctUntilChanged, fromEvent, map, take, tap } from "rxjs";

@Component({
    selector: "mona-range-slider2",
    templateUrl: "./range-slider.component.html",
    styleUrls: ["./range-slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeSliderComponent implements AfterViewInit {
    #value: [number, number] = [0, 0];
    public dragging: WritableSignal<boolean> = signal(false);
    public handlerValue: WritableSignal<[number, number]> = signal([0, 0]);
    public handlerPosition: Signal<[number, number]> = computed(() => {
        return [0, 0];
    });
    public trackSelectionPositions: Signal<{ size: number; position: number }> = signal({
        position: 0,
        size: 0
    });

    public ticks: SliderTick[] = [];

    @Input()
    public labelPosition: SliderLabelPosition = "before";

    @Input()
    public labelStep: number = 1;

    @Input()
    public max: number = 20;

    @Input()
    public min: number = 0;

    @Input()
    public orientation: "horizontal" | "vertical" = "horizontal";

    @ViewChild("primaryHandlerRef")
    public primaryHandlerRef!: ElementRef<HTMLDivElement>;

    @ViewChild("secondaryHandlerRef")
    public secondaryHandlerRef!: ElementRef<HTMLDivElement>;

    @Input()
    public showTicks: boolean = true;

    @Input()
    public step: number = 1;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<any>;

    @Input()
    public set value(value: [number, number]) {
        this.#value = value;
        this.handlerValue.set(value);
    }
    public get value(): [number, number] {
        return this.#value;
    }

    @Output()
    public valueChange: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

    public constructor(
        private readonly elementRef: ElementRef<HTMLDivElement>,
        private readonly cdr: ChangeDetectorRef
    ) {}

    public ngAfterViewInit() {
        this.setHandlerPositionsSignal();
        this.setTrackSelectionSignal();
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {
        this.prepareTicks();
    }

    public onHandleKeyDown(event: KeyboardEvent, type: SliderHandlerType): void {
        const value = type === "primary" ? this.handlerValue()[0] : this.handlerValue()[1];
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            if (value - this.step < this.min) {
                return;
            }
            this.setHandlerValue(value - this.step, type);
        } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            if (value + this.step > this.max) {
                return;
            }
            this.setHandlerValue(value + this.step, type);
        }
        if (!this.dragging()) {
            fromEvent(event.target as HTMLElement, "keyup")
                .pipe(take(1))
                .subscribe(() => {
                    this.dragging.set(false);
                });
            this.dragging.set(true);
        }
    }

    public onHandlerMouseDown(event: MouseEvent, type: SliderHandlerType): void {
        const moveSubscription = fromEvent(document, "mousemove")
            .pipe(
                tap(() => this.dragging.set(true)),
                map((moveEvent: Event) => {
                    const tickElement = this.findClosestTickElement(moveEvent as MouseEvent);
                    return Number(tickElement.getAttribute("data-value"));
                }),
                distinctUntilChanged()
            )
            .subscribe((value: number) => {
                this.setHandlerValue(value, type);
            });
        fromEvent(document, "mouseup")
            .pipe(take(1))
            .subscribe(() => {
                this.dragging.set(false);
                moveSubscription.unsubscribe();
            });
    }

    public onTickClick(event: MouseEvent, tick: SliderTick): void {
        const handlerData = this.getClosestHandlerDataToMouse(event);
        this.setHandlerValue(tick.value, handlerData.type);
    }

    private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
        const elements = Array.from(
            this.elementRef.nativeElement.querySelectorAll(".mona-range-slider2-tick > span")
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
        const primaryHandlerRect = this.primaryHandlerRef.nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.secondaryHandlerRef.nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(
            Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2)
        );
        const secondaryDistance = Math.sqrt(
            Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
                Math.pow(secondaryHandlerRect.top - event.clientY, 2)
        );
        return primaryDistance < secondaryDistance
            ? {
                  element: this.primaryHandlerRef.nativeElement,
                  type: "primary"
              }
            : {
                  element: this.secondaryHandlerRef.nativeElement,
                  type: "secondary"
              };
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
        if (this.orientation === "vertical") {
            this.ticks.reverse();
        }
    }

    private setHandlerPositionsSignal(): void {
        this.handlerPosition = computed(() => {
            const element = this.elementRef.nativeElement;
            const rect = element.getBoundingClientRect();
            const primaryHandlerRect = this.primaryHandlerRef.nativeElement.getBoundingClientRect();
            const secondaryHandlerRect = this.secondaryHandlerRef.nativeElement.getBoundingClientRect();
            const distance = this.orientation === "horizontal" ? rect.right - rect.left : rect.bottom - rect.top;
            const primaryValue = Math.max(this.min, Math.min(this.handlerValue()[0], this.max));
            const secondaryValue = Math.max(this.min, Math.min(this.handlerValue()[1], this.max));
            const primaryPercentage = (primaryValue - this.min) / (this.max - this.min);
            const secondaryPercentage = (secondaryValue - this.min) / (this.max - this.min);
            const primaryOffset =
                this.orientation === "horizontal" ? primaryHandlerRect.width / 2 : primaryHandlerRect.height / 2;
            const secondaryOffset =
                this.orientation === "horizontal" ? secondaryHandlerRect.width / 2 : secondaryHandlerRect.height / 2;
            const positions: [number, number] = [
                Math.max(distance * primaryPercentage - primaryOffset, -primaryOffset),
                Math.max(distance * secondaryPercentage - secondaryOffset, -secondaryOffset)
            ];
            return positions;
        });
    }

    private setHandlerValue(value: number, type: SliderHandlerType): void {
        if (type === "primary") {
            this.handlerValue.update(currentValue => [value, currentValue[1]]);
        } else {
            this.handlerValue.update(currentValue => [currentValue[0], value]);
        }
        this.valueChange.emit(this.handlerValue());
    }

    private setTrackSelectionSignal(): void {
        this.trackSelectionPositions = computed(() => {
            return {
                position: Math.min(this.handlerPosition()[0], this.handlerPosition()[1]),
                size: Math.abs(this.handlerPosition()[1] - this.handlerPosition()[0])
            };
        });
    }
}
