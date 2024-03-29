import {
    AfterViewInit,
    DestroyRef,
    Directive,
    ElementRef,
    inject,
    input,
    NgZone,
    output,
    OutputEmitterRef
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
    readonly #hostElementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    readonly #zone: NgZone = inject(NgZone);

    public readonly resizeEnd: OutputEmitterRef<void> = output();
    public readonly resizeStart: OutputEmitterRef<void> = output();
    public column = input.required<Column>();

    public ngAfterViewInit(): void {
        this.setEvents();
    }

    private onMouseDown(event: MouseEvent) {
        const element = this.#hostElementRef.nativeElement;
        const initialWidth = this.column().calculatedWidth() ?? element.getBoundingClientRect().width;
        const initialX = event.clientX;
        const oldSelectStart = document.onselectstart;
        const headerTableElement = element.closest("table");
        const bodyTableElement = document.querySelector(".mona-grid-list-wrap > table") as HTMLTableElement;

        document.onselectstart = () => false;

        this.resizeStart.emit();

        const onMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX;
            const minWidth = this.column().minWidth;
            const maxWidth = this.column().maxWidth ?? window.innerWidth;

            if (initialWidth + deltaX < minWidth) {
                return;
            }

            if (initialWidth + deltaX > maxWidth) {
                return;
            }

            const oldWidth = this.column().calculatedWidth() ?? element.getBoundingClientRect().width;
            this.column().calculatedWidth.set(initialWidth + deltaX);
            const calculatedWidth = this.column().calculatedWidth() as number;
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

            // this.cdr.detectChanges();
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
        this.#zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "mousedown")
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(event => {
                    event.stopImmediatePropagation();
                    this.onMouseDown(event);
                });
        });
    }
}
