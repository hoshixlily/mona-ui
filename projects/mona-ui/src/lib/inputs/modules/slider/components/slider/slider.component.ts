import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    Renderer2
} from "@angular/core";
import { fromEvent } from "rxjs";

@Component({
    selector: "mona-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, AfterViewInit {
    public dragging: boolean = false;
    public handlerLeftPosition: number = 0;

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

    public ngOnInit(): void {}

    public onHandlerMouseDown(): void {
        if (this.dragging) {
            return;
        }
        this.dragging = true;
        document.documentElement.style.userSelect = "none";
    }

    public onTickClick(
        event: MouseEvent,
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): void {
        this.handlerLeftPosition = this.findHandlerPosition(
            event,
            tickElement,
            sliderTrackElement,
            sliderHandlerElement
        );
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

    private findHandlerPosition(
        event: MouseEvent,
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): number {
        const rect = tickElement.getBoundingClientRect();
        const containerRect = sliderTrackElement.getBoundingClientRect();
        const handlerRect = sliderHandlerElement.getBoundingClientRect();

        const distanceToLeft = Math.abs(rect.left - event.clientX);
        const distanceToRight = Math.abs(rect.right - event.clientX);

        if (distanceToLeft > distanceToRight) {
            return rect.right - containerRect.left - handlerRect.width / 2;
        } else {
            const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
            if (siblingRect) {
                return siblingRect.right - containerRect.left - handlerRect.width / 2;
            } else {
                return (-1 * handlerRect.width) / 2;
            }
        }
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            this.renderer.listen(document, "mousemove", (event: MouseEvent) => {
                if (!this.dragging) {
                    return;
                }
                const tickElement = this.findClosestTickElement(event);
                const position = this.findHandlerPosition(
                    event,
                    tickElement.parentElement as HTMLSpanElement,
                    this.elementRef.nativeElement.querySelector(".mona-slider-track") as HTMLDivElement,
                    this.elementRef.nativeElement.querySelector(".mona-slider-handler") as HTMLDivElement
                );
                if (position !== this.handlerLeftPosition) {
                    this.zone.run(() => {
                        this.handlerLeftPosition = position;
                        this.cdr.detectChanges();
                    });
                }
            });
            fromEvent(document, "mouseup").subscribe(() => {
                if (!this.dragging) {
                    return;
                }
                this.zone.run(() => {
                    this.dragging = false;
                    document.documentElement.style.removeProperty("user-select");
                    console.log("dragging", this.dragging);
                });
            });
        });
    }
}
