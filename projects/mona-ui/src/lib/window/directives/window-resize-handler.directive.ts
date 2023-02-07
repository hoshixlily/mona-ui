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
    public maxHeight?: number;

    @Input()
    public maxWidth?: number;

    @Input()
    public minHeight?: number;

    @Input()
    public minWidth?: number;

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

        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        document.onselectstart = () => false;
        document.ondragstart = () => false;

        const onMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const minWidth = this.minWidth ?? 50;
            const minHeight = this.minHeight ?? 50;
            const maxWidth = this.maxWidth ?? window.innerWidth;
            const maxHeight = this.maxHeight ?? window.innerHeight;

            switch (this.direction) {
                case "northwest":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }

                    element.style.top = `${initialTop + deltaY}px`;
                    element.style.height = `${initialHeight - deltaY}px`;

                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }

                    element.style.left = `${initialLeft + deltaX}px`;
                    element.style.width = `${initialWidth - deltaX}px`;
                    break;
                case "north":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight) {
                        return;
                    }
                    element.style.top = `${initialTop + deltaY}px`;
                    element.style.height = `${initialHeight - deltaY}px`;
                    break;
                case "northeast":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
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
                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    if (initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    element.style.width = `${initialWidth + deltaX}px`;
                    break;
                case "southeast":
                    if (
                        initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight
                    ) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    element.style.height = `${initialHeight + deltaY}px`;

                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    element.style.width = `${initialWidth + deltaX}px`;
                    break;
                case "south":
                    if (
                        initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight
                    ) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight) {
                        return;
                    }
                    element.style.height = `${initialHeight + deltaY}px`;
                    break;
                case "southwest":
                    if (
                        initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight
                    ) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }

                    element.style.height = `${initialHeight + deltaY}px`;

                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    element.style.left = `${initialLeft + deltaX}px`;
                    element.style.width = `${initialWidth - deltaX}px`;
                    break;
                case "west":
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    if (initialWidth - deltaX > maxWidth) {
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
