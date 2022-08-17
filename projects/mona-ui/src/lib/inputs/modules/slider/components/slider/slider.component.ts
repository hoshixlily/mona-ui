import { Component, ElementRef, NgZone, OnInit } from "@angular/core";
import { fromEvent } from "rxjs";

@Component({
    selector: "mona-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"]
})
export class SliderComponent implements OnInit {
    private dragging: boolean = false;
    public handlerLeftPosition: number = 0;

    public constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly zone: NgZone) {}

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public onHandlerMouseDown(): void {
        if (this.dragging) {
            return;
        }
        this.dragging = true;
    }

    public onTickClick(
        event: MouseEvent,
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): void {
        this.setHandlerPosition(event, tickElement, sliderTrackElement, sliderHandlerElement);
    }

    public onTickMouseMove(
        event: MouseEvent,
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): void {
        if (!this.dragging) {
            return;
        }
        this.setHandlerPosition(event, tickElement, sliderTrackElement, sliderHandlerElement);
    }

    private setHandlerPosition(
        event: MouseEvent,
        tickElement: HTMLSpanElement,
        sliderTrackElement: HTMLDivElement,
        sliderHandlerElement: HTMLDivElement
    ): void {
        const rect = tickElement.getBoundingClientRect();
        const containerRect = sliderTrackElement.getBoundingClientRect();
        const handlerRect = sliderHandlerElement.getBoundingClientRect();

        const distanceToLeft = event.clientX - rect.left;
        const distanceToRight = rect.right - event.clientX;

        if (distanceToLeft > distanceToRight) {
            this.handlerLeftPosition = rect.left - containerRect.left + handlerRect.width / 2;
        } else {
            const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
            if (siblingRect) {
                this.handlerLeftPosition = siblingRect.left - containerRect.left + handlerRect.width / 2;
            } else {
                this.handlerLeftPosition = (-1 * handlerRect.width) / 2;
            }
        }
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            const elements = document.querySelectorAll(".mona-slider-tick > span");
            fromEvent(elements, "mousemove", (event: MouseEvent) => {
                if (!this.dragging) {
                    return;
                }
                const tickElement = event.target as HTMLSpanElement;
                this.zone.run(() => {
                    this.setHandlerPosition(
                        event,
                        tickElement.parentElement as HTMLSpanElement,
                        this.elementRef.nativeElement.querySelector(".mona-slider-track") as HTMLDivElement,
                        this.elementRef.nativeElement.querySelector(".mona-slider-handler") as HTMLDivElement
                    );
                });
            });
            fromEvent(document, "mouseup").subscribe(() => {
                if (!this.dragging) {
                    return;
                }
                this.zone.run(() => {
                    this.dragging = false;
                });
            });
        });
    }
}
