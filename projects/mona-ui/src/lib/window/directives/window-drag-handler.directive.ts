import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { WindowReference } from "../models/WindowReference";

@Directive({
    selector: "div[monaWindowDragHandler]"
})
export class WindowDragHandlerDirective implements AfterViewInit, OnDestroy {
    readonly #destroy$: Subject<void> = new Subject<void>();

    @Input()
    public draggable?: boolean = false;

    @Input()
    public windowRef!: WindowReference;

    public constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly zone: NgZone) {}

    public ngAfterViewInit(): void {
        this.setEvents();
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    public onMouseDown(event: MouseEvent) {
        if (!this.draggable) {
            return;
        }

        const element = this.elementRef.nativeElement.parentElement?.parentElement?.parentElement as HTMLElement;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;
        let dragInitiated = false;

        const onMouseMove = (event: MouseEvent) => {
            if (!dragInitiated) {
                dragInitiated = true;
                this.windowRef.moveStart$$.next();
            }
            if (
                event.clientX < 0 ||
                event.clientX > window.innerWidth ||
                event.clientY < 0 ||
                event.clientY > window.innerHeight
            ) {
                return;
            }
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const top = initialTop + deltaY;
            const left = initialLeft + deltaX;
            element.style.top = `${top}px`;
            element.style.left = `${left}px`;
            this.windowRef.move$$.next({ top, left });
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (dragInitiated) {
                this.windowRef.moveEnd$$.next();
                dragInitiated = false;
            }
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    private setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.#destroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
}
