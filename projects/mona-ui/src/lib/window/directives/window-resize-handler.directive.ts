import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from "@angular/core";
import { WindowResizeHandlerDirection } from "../models/WindowResizeHandlerDirection";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { WindowReference } from "../models/WindowReference";

@Directive({
    selector: "div[monaWindowResizeHandler]",
    standalone: true
})
export class WindowResizeHandlerDirective implements AfterViewInit, OnDestroy {
    private readonly destroy$: Subject<void> = new Subject<void>();

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
    public windowRef!: WindowReference;

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>, private readonly zone: NgZone) {}

    public ngAfterViewInit(): void {
        this.setEvents();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onMouseDown(event: MouseEvent) {
        const element = this.windowRef.element;
        const initialWidth = element.getBoundingClientRect().width;
        const initialHeight = element.getBoundingClientRect().height;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.getBoundingClientRect().top;
        const initialLeft = element.getBoundingClientRect().left;
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
            let height: number | undefined;
            let left: number | undefined;
            let width: number | undefined;
            let top: number | undefined;

            switch (this.direction) {
                case "northwest":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }

                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;

                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }

                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.left = `${left}px`;
                    element.style.width = `${width}px`;
                    break;
                case "north":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    break;
                case "northeast":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
                        return;
                    }

                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;

                    if (initialWidth + deltaX < 100 || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }

                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "east":
                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    if (initialWidth + deltaX > maxWidth) {
                        return;
                    }

                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
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

                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;

                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }

                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
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

                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
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

                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;

                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }

                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.width = `${width}px`;
                    element.style.left = `${left}px`;
                    break;
                case "west":
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    if (initialWidth - deltaX > maxWidth) {
                        return;
                    }

                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.width = `${width}px`;
                    element.style.left = `${left}px`;
                    break;
            }

            this.windowRef.resize$$.next({
                width: width ?? initialWidth,
                height: height ?? initialHeight,
                left: left ?? initialLeft,
                top: top ?? initialTop
            });
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
                .pipe(takeUntil(this.destroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
}
