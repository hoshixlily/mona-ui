import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { Action } from "../../../../../utils/Action";
import { SliderTick } from "../../models/SliderTick";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { SliderHandlerPositionData } from "../../models/SliderHandlerPositionData";

@Component({
    selector: "mona-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"]
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject();
    private documentMouseMoveListener: Action | null = null;
    public dragging: boolean = false;
    public handlerLeftPosition: number = 0;
    public ticks: SliderTick[] = [];

    @Input()
    public max: number = 100;

    @Input()
    public min: number = 0;

    @Input()
    public step: number = 10;

    @ViewChild("tickListElement", { read: ElementRef })
    private tickListElementRef!: ElementRef<HTMLDivElement>;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<void>;

    @Input()
    public value: number = 0;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private readonly cdr: ChangeDetectorRef,
        private readonly zone: NgZone
    ) {}

    // public ngAfterContentChecked(): void {
    //     console.log("ngAfterContentChecked");
    // }

    public ngAfterViewInit(): void {
        this.setEventListeners();
    }

    public ngOnDestroy(): void {
        this.documentMouseMoveListener?.();
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
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

    public onHandlerMouseDown(): void {
        if (this.dragging) {
            return;
        }
        this.dragging = true;
        document.documentElement.style.userSelect = "none";
    }

    public onTickClick(
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): void {
        const positionData = this.getHandlerPositionData(tickElement, sliderTrackElement, sliderHandlerElement);
        this.handlerLeftPosition = positionData.position;
        this.value = this.ticks[positionData.tickIndex].value;
        console.log(this.value);
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
            position = rect.right - containerRect.left - handlerRect.width / 2;
        } else {
            const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
            if (siblingRect) {
                position = siblingRect.right - containerRect.left - handlerRect.width / 2;
            } else {
                position = (-1 * handlerRect.width) / 2;
            }
        }

        return { position, tickIndex };
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
                        this.handlerLeftPosition = positionData.position;
                        this.value = this.ticks[positionData.tickIndex].value;
                        console.log("Slider value: ", this.value);
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
                        document.documentElement.style.removeProperty("user-select");
                    });
                });
        });
    }
}
