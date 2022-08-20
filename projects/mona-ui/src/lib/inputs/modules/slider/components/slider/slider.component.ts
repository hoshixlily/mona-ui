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
import { fromEvent, Subject, takeUntil } from "rxjs";
import { Action } from "../../../../../utils/Action";
import { SliderTick } from "../../models/SliderTick";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { SliderHandlerPositionData } from "../../models/SliderHandlerPositionData";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

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
    private propagateChange: Action<number> | null = null;
    public dragging: boolean = false;
    public handlerLeftPosition: number = 0;
    public ticks: SliderTick[] = [];

    @Input()
    public max: number = 10;

    @Input()
    public min: number = 0;

    @Input()
    public showTicks: boolean = true;

    @Input()
    public step: number = 1;

    @ViewChild("tickListElement", { read: ElementRef })
    private tickListElementRef!: ElementRef<HTMLDivElement>;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<void>;

    @Input()
    public value: number = 0;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter<number>();

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        private readonly cdr: ChangeDetectorRef,
        private readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        this.setEventListeners();
        window.setTimeout(() => {
            this.setSliderValue(this.value);
            this.cdr.detectChanges();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"].currentValue != null && !changes["value"].isFirstChange()) {
            this.setSliderValue(changes["value"].currentValue);
        }
    }

    public ngOnDestroy(): void {
        this.documentMouseMoveListener?.();
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.prepareTicks();
        this.value = Math.max(this.min, Math.min(this.max, this.value));
    }

    public onHandlerMouseDown(): void {
        if (this.dragging) {
            return;
        }
        this.dragging = true;
        this.previousUserSelect = document.documentElement.style.userSelect;
        document.documentElement.style.userSelect = "none";
    }

    public onTickClick(
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): void {
        const positionData = this.getHandlerPositionData(tickElement, sliderTrackElement, sliderHandlerElement);
        const value = this.ticks[positionData.tickIndex].value;
        this.setSliderValue(value);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
        void 0;
    }

    public writeValue(obj: any): void {
        if (obj != null) {
            this.setSliderValue(obj);
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

    private getHandlerPositionData(
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): SliderHandlerPositionData {
        const rect = tickElement.getBoundingClientRect();
        const containerRect = sliderTrackElement.getBoundingClientRect();
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
                    ((siblingRect.right - containerRect.left - handlerRect.width / 2) * 100.0) / containerRect.width;
            } else {
                position = (((-1 * handlerRect.width) / 2) * 100.0) / containerRect.width;
            }
        }

        return { position, tickIndex };
    }

    private prepareTicks(): void {
        let index = 0;
        const tickCount = (this.max - this.min) / this.step + 1;
        for (let tx = 0; tx < tickCount; tx++) {
            this.ticks.push({
                index: index,
                value: this.min + index * this.step
            });
            index++;
        }
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
                    this.elementRef.nativeElement.querySelector(".mona-slider-track") as HTMLDivElement,
                    this.elementRef.nativeElement.querySelector(".mona-slider-handler") as HTMLDivElement
                );
                if (positionData.position !== this.handlerLeftPosition) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        this.setSliderValue(value);
                    });
                }
            });
            fromEvent(document, "mouseup")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(() => {
                    if (!this.dragging) {
                        return;
                    }
                    this.zone.run(() => {
                        this.dragging = false;
                        if (this.previousUserSelect) {
                            document.documentElement.style.userSelect = this.previousUserSelect;
                        }
                    });
                });
        });
    }

    private setSliderValue(value: number): void {
        const trackElement = this.elementRef.nativeElement.querySelector(".mona-slider-track") as HTMLDivElement;
        const handlerElement = this.elementRef.nativeElement.querySelector(".mona-slider-handler") as HTMLDivElement;
        const sliderValue = Math.max(this.min, Math.min(this.max, value));
        this.handlerLeftPosition =
            ((sliderValue - this.min) * 100.0) / (this.max - this.min) -
            ((handlerElement.clientWidth / 2) * 100.0) / trackElement.clientWidth;
        this.value = sliderValue;
        this.valueChange.emit(this.value);
        this.propagateChange?.(this.value);
    }
}
