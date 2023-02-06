import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from "@angular/core";
import { WindowResizeHandlerDirection } from "../models/WindowResizeHandlerDirection";
import { PopupRef } from "../../popup/models/PopupRef";
import { fromEvent, Subject, takeUntil } from "rxjs";

@Directive({
    selector: "div[monaWindowResizeHandler]"
})
export class WindowResizeHandlerDirective implements AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();

    @Input()
    public direction!: WindowResizeHandlerDirection;

    @Input()
    public windowRef!: PopupRef;
    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>, private readonly zone: NgZone) {}

    public ngAfterViewInit(): void {
        this.setEvents();
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public onMouseDown(event: MouseEvent) {
        const element = this.windowRef.overlayRef.overlayElement;
        const initialWidth = element.offsetWidth;
        const initialHeight = element.offsetHeight;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;

        // disable selection event on document while resizing
        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        document.onselectstart = () => false;
        document.ondragstart = () => false;

        const onMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            switch (this.direction) {
                case "northwest":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < 100) {
                        return;
                    }
                    element.style.top = `${initialTop + deltaY}px`;
                    element.style.height = `${initialHeight - deltaY}px`;

                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < 100) {
                        return;
                    }
                    element.style.left = `${initialLeft + deltaX}px`;
                    element.style.width = `${initialWidth - deltaX}px`;
                    break;
                case "north":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < 100) {
                        return;
                    }
                    element.style.top = `${initialTop + deltaY}px`;
                    element.style.height = `${initialHeight - deltaY}px`;
                    break;
                case "northeast":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < 100) {
                        return;
                    }
                    element.style.top = `${initialTop + deltaY}px`;
                    element.style.height = `${initialHeight - deltaY}px`;

                    if (initialWidth + deltaX < 100 || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    element.style.width = `${initialWidth + deltaX}px`;
                    break;
                case "east":
                    if (initialWidth + deltaX < 100 || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    element.style.width = `${initialWidth + deltaX}px`;
                    break;
                case "southeast":
                    if (initialHeight + deltaY < 100 || initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    element.style.height = `${initialHeight + deltaY}px`;

                    if (initialWidth + deltaX < 100 || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    element.style.width = `${initialWidth + deltaX}px`;
                    break;
                case "south":
                    if (initialHeight + deltaY < 100 || initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    element.style.height = `${initialHeight + deltaY}px`;
                    break;
                case "southwest":
                    if (initialHeight + deltaY < 100 || initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    element.style.height = `${initialHeight + deltaY}px`;

                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < 100) {
                        return;
                    }
                    element.style.left = `${initialLeft + deltaX}px`;
                    element.style.width = `${initialWidth - deltaX}px`;
                    break;
                case "west":
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < 100) {
                        return;
                    }
                    element.style.left = `${initialLeft + deltaX}px`;
                    element.style.width = `${initialWidth - deltaX}px`;
                    break;
            }
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            // enable selection event on document after resizing
            document.onselectstart = oldSelectStart;
            document.ondragstart = oldDragStart;
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    private setEvents(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
}
