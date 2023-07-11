import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { SliderTick } from "../../../slider/models/SliderTick";
import { SliderLabelPosition } from "../../../slider/models/SliderLabelPosition";
import { SliderTickValueTemplateDirective } from "../../../slider/directives/slider-tick-value-template.directive";
import { distinctUntilChanged, fromEvent, map, tap } from "rxjs";

@Component({
    selector: "mona-slider2",
    templateUrl: "./slider2.component.html",
    styleUrls: ["./slider2.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Slider2Component implements OnInit {
    public dragging: WritableSignal<boolean> = signal(false);
    public handlerValue: WritableSignal<number> = signal(0);
    public handlerPosition: Signal<number> = computed(() => {
        const value = this.trackSelectionWidth();
        return value === 0 ? value - 9 : value - 7;
    });
    public trackSelectionWidth: Signal<number> = computed(() => {
        const element = this.elementRef.nativeElement;
        const rect = element.getBoundingClientRect();
        const distance = this.orientation === "horizontal" ? rect.right - rect.left : rect.bottom - rect.top;
        const percentage = (this.handlerValue() - this.min) / (this.max - this.min);
        return Math.max(distance * percentage - 2, 0);
    });

    public ticks: SliderTick[] = [];

    @ViewChild("handlerElementRef")
    public handlerElementRef!: ElementRef<HTMLDivElement>;

    @Input()
    public labelPosition: SliderLabelPosition = "after";

    @Input()
    public labelStep: number = 1;

    @Input()
    public max: number = 20;

    @Input()
    public min: number = 0;

    @Input()
    public orientation: "horizontal" | "vertical" = "horizontal";

    @Input()
    public showTicks: boolean = true;

    @Input()
    public step: number = 1;

    @ContentChild(SliderTickValueTemplateDirective, { read: TemplateRef })
    public tickValueTemplate?: TemplateRef<any>;

    @Input()
    public value: number = 0;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter<number>();

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>) {}

    public ngOnInit(): void {
        if (this.value != null) {
            this.handlerValue.set(this.value);
        }
        this.prepareTicks();
    }

    public onHandlerKeyDown(event: KeyboardEvent): void {
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            if (this.handlerValue() - this.step >= this.min) {
                this.setHandlerValue(this.handlerValue() - this.step);
            } else {
                this.setHandlerValue(this.min);
            }
        } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            if (this.handlerValue() + this.step <= this.max) {
                this.setHandlerValue(this.handlerValue() + this.step);
            } else {
                this.setHandlerValue(this.max);
            }
        }
    }

    public onHandlerMouseDown(event: MouseEvent): void {
        const moveSubscription = fromEvent(document, "mousemove")
            .pipe(
                tap(() => this.dragging.set(true)),
                map((moveEvent: Event) => {
                    const tickElement = this.findClosestTickElement(moveEvent as MouseEvent);
                    return Number(tickElement.getAttribute("data-value"));
                }),
                distinctUntilChanged()
            )
            .subscribe((tickValue: number) => {
                this.setHandlerValue(tickValue);
            });
        fromEvent(document, "mouseup").subscribe(() => {
            this.dragging.set(false);
            moveSubscription.unsubscribe();
        });
    }

    public onTickClick(event: MouseEvent, tick: SliderTick): void {
        this.setHandlerValue(tick.value);
    }

    private findClosestTickElement(event: MouseEvent): HTMLSpanElement {
        const elements = Array.from(
            this.elementRef.nativeElement.querySelectorAll(".mona-slider2-tick > span")
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

    private setHandlerValue(value: number): void {
        this.handlerValue.set(value);
        this.valueChange.emit(value);
    }
}
