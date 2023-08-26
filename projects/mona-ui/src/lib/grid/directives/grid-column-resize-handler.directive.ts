import {
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    Output
} from "@angular/core";
import { Column } from "../models/Column";
import { fromEvent, Subject, takeUntil } from "rxjs";

@Directive({
    selector: "[monaGridColumnResizeHandler]",
    standalone: true
})
export class GridColumnResizeHandlerDirective implements AfterViewInit, OnDestroy {
    readonly #destroy$: Subject<void> = new Subject<void>();

    @Input()
    public column!: Column;

    @Output()
    public resizeEnd: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public resizeStart: EventEmitter<void> = new EventEmitter<void>();

    public constructor(
        private readonly elementRef: ElementRef<HTMLDivElement>,
        private readonly zone: NgZone,
        private readonly cdr: ChangeDetectorRef
    ) {}

    public ngAfterViewInit(): void {
        this.setEvents();
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    private onMouseDown(event: MouseEvent) {
        const element = this.elementRef.nativeElement;
        const initialWidth = this.column.calculatedWidth ?? element.getBoundingClientRect().width;
        const initialX = event.clientX;
        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        const headerTableElement = element.closest("table");
        const bodyTableElement = document.querySelector(".mona-grid-list-wrap > table") as HTMLTableElement;

        document.onselectstart = () => false;
        // document.ondragstart = () => false;

        this.resizeStart.emit();

        const onMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX;
            const minWidth = this.column.minWidth;
            const maxWidth = this.column.maxWidth ?? window.innerWidth;

            if (initialWidth + deltaX < minWidth) {
                return;
            }

            if (initialWidth + deltaX > maxWidth) {
                return;
            }

            const oldWidth = this.column.calculatedWidth || element.getBoundingClientRect().width;
            this.column.calculatedWidth = initialWidth + deltaX;
            if (headerTableElement) {
                headerTableElement.style.width = `${
                    headerTableElement.getBoundingClientRect().width + (this.column.calculatedWidth - oldWidth)
                }px`;
            }
            if (bodyTableElement) {
                bodyTableElement.style.width = `${
                    bodyTableElement.getBoundingClientRect().width + (this.column.calculatedWidth - oldWidth)
                }px`;
            }

            this.cdr.detectChanges();
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.onselectstart = oldSelectStart;
            // document.ondragstart = oldDragStart;
            this.resizeEnd.emit();
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    private setEvents(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.#destroy$))
                .subscribe(event => {
                    event.stopImmediatePropagation();
                    this.onMouseDown(event);
                });
        });
    }
}
