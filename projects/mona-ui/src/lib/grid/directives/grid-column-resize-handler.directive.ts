import {
    AfterViewInit,
    ChangeDetectorRef,
    DestroyRef,
    Directive,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    NgZone,
    Output
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { Column } from "../models/Column";

@Directive({
    selector: "[monaGridColumnResizeHandler]",
    standalone: true
})
export class GridColumnResizeHandlerDirective implements AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

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

    private onMouseDown(event: MouseEvent) {
        const element = this.elementRef.nativeElement;
        const initialWidth = this.column.calculatedWidth() ?? element.getBoundingClientRect().width;
        const initialX = event.clientX;
        const oldSelectStart = document.onselectstart;
        const headerTableElement = element.closest("table");
        const bodyTableElement = document.querySelector(".mona-grid-list-wrap > table") as HTMLTableElement;

        document.onselectstart = () => false;

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

            const oldWidth = this.column.calculatedWidth() ?? element.getBoundingClientRect().width;
            this.column.calculatedWidth.set(initialWidth + deltaX);
            const calculatedWidth = this.column.calculatedWidth() as number;
            if (headerTableElement) {
                headerTableElement.style.width = `${
                    headerTableElement.getBoundingClientRect().width + (calculatedWidth - oldWidth)
                }px`;
            }
            if (bodyTableElement) {
                bodyTableElement.style.width = `${
                    bodyTableElement.getBoundingClientRect().width + (calculatedWidth - oldWidth)
                }px`;
            }

            this.cdr.detectChanges();
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.onselectstart = oldSelectStart;
            this.resizeEnd.emit();
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    private setEvents(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(event => {
                    event.stopImmediatePropagation();
                    this.onMouseDown(event);
                });
        });
    }
}
