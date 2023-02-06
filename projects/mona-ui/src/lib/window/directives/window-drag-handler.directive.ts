import { AfterViewInit, Directive, ElementRef, OnDestroy } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";

@Directive({
    selector: "div[monaWindowDragHandler]"
})
export class WindowDragHandlerDirective implements AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    public constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    public ngAfterViewInit(): void {
        this.setEvents();
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public onMouseDown(event: MouseEvent) {
        const element = this.elementRef.nativeElement.parentElement?.parentElement?.parentElement as HTMLElement;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;
        const initialWidth = element.offsetWidth;
        const initialHeight = element.offsetHeight;

        const onMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            element.style.top = `${initialTop + deltaY}px`;
            element.style.left = `${initialLeft + deltaX}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    private setEvents() {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => this.onMouseDown(event));
    }
}
