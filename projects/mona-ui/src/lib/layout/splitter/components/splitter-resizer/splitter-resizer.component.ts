import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnInit, signal } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { filter, fromEvent, skipUntil, takeUntil, tap } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Orientation } from "../../../../models/Orientation";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";

@Component({
    selector: "mona-splitter-resizer",
    standalone: true,
    imports: [FaIconComponent, ButtonDirective],
    template: `
        @if (resizable()) {
            <div class="mona-splitter-resizer-handle"></div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-splitter-resizer",
        "[class.mona-splitter-resizer-horizontal]": "orientation()==='horizontal'",
        "[class.mona-splitter-resizer-vertical]": "orientation()==='vertical'",
        "[class.mona-splitter-resizer-resizing]": "resizing()",
        "[style.cursor]": "resizable() ? (orientation()==='horizontal' ? 'ew-resize' : 'ns-resize') : 'auto'"
    }
})
export class SplitterResizerComponent implements OnInit {
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    protected readonly resizable = computed(() => {
        return this.previousPane().resizable() && this.nextPane().resizable();
    });
    protected readonly resizing = signal(false);
    public nextPane = input.required<SplitterPaneComponent>();
    public orientation = input.required<Orientation>();
    public previousPane = input.required<SplitterPaneComponent>();

    public ngOnInit(): void {
        this.setEvents();
    }

    private getPaneElements(): [HTMLElement, HTMLElement] {
        const previousPane = this.#hostElementRef.nativeElement.previousElementSibling;
        const nextPane = this.#hostElementRef.nativeElement.nextElementSibling;
        if (previousPane === null || nextPane === null) {
            throw new Error("The previous or next pane element is not found.");
        }
        return [previousPane as HTMLDivElement, nextPane as HTMLDivElement];
    }

    private getPaneRectangles(): [DOMRect, DOMRect] {
        const [previousPane, nextPane] = this.getPaneElements();
        return [previousPane.getBoundingClientRect(), nextPane.getBoundingClientRect()];
    }

    private setEvents(): void {
        fromEvent<PointerEvent>(document, "pointermove")
            .pipe(
                skipUntil(
                    fromEvent<PointerEvent>(this.#hostElementRef.nativeElement, "pointerdown").pipe(
                        filter(() => this.resizable()),
                        tap(event => {
                            event.preventDefault();
                            this.#hostElementRef.nativeElement.setPointerCapture(event.pointerId);
                            this.resizing.set(true);
                        })
                    )
                ),
                takeUntil(
                    fromEvent<PointerEvent>(this.#hostElementRef.nativeElement, "pointerup").pipe(
                        tap(event => {
                            this.#hostElementRef.nativeElement.releasePointerCapture(event.pointerId);
                            this.resizing.set(false);
                            this.setEvents();
                        })
                    )
                )
            )
            .subscribe(event => {
                const orientation = this.orientation();
                if (orientation === "horizontal") {
                    this.updateHorizontalPaneSizes(event);
                } else {
                    this.updateVerticalPaneSizes(event);
                }
            });
    }

    private updateHorizontalPaneSizes(event: PointerEvent): void {
        const [previousRect, nextRect] = this.getPaneRectangles();
        const maxWidth = previousRect.width + nextRect.width;
        const previousPaneWidth = Math.min(Math.max(event.clientX - previousRect.left, 0), maxWidth);
        const nextPaneWidth = maxWidth - previousPaneWidth;
        const previousPaneSize = `${previousPaneWidth}px`;
        const nextPaneSize = `${nextPaneWidth}px`;
        this.updatePaneSizes(previousPaneSize, nextPaneSize);
    }

    private updatePaneSizes(previousPaneSize: string, nextPaneSize: string): void {
        this.previousPane().size.set(previousPaneSize);
        this.nextPane().size.set(nextPaneSize);
    }

    private updateVerticalPaneSizes(event: PointerEvent): void {
        const [previousRect, nextRect] = this.getPaneRectangles();
        const maxHeight = previousRect.height + nextRect.height;
        const previousPaneHeight = Math.min(Math.max(event.clientY - previousRect.top, 0), maxHeight);
        const nextPaneHeight = maxHeight - previousPaneHeight;
        const previousPaneSize = `${previousPaneHeight}px`;
        const nextPaneSize = `${nextPaneHeight}px`;
        this.updatePaneSizes(previousPaneSize, nextPaneSize);
    }
}
