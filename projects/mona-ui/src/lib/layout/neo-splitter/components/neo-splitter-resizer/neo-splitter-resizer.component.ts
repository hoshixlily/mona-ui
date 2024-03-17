import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit,
    signal,
    WritableSignal
} from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { filter, fromEvent, skipUntil, takeUntil, tap } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Orientation } from "../../../../models/Orientation";
import { NeoSplitterPaneComponent } from "../neo-splitter-pane/neo-splitter-pane.component";

@Component({
    selector: "mona-neo-splitter-resizer",
    standalone: true,
    imports: [FaIconComponent, ButtonDirective],
    template: ` <div class="mona-neo-splitter-resizer-handle"></div> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-neo-splitter-resizer",
        "[class.mona-neo-splitter-resizer-horizontal]": "orientation()==='horizontal'",
        "[class.mona-neo-splitter-resizer-vertical]": "orientation()==='vertical'",
        "[class.mona-neo-splitter-resizer-resizing]": "resizing()"
    }
})
export class NeoSplitterResizerComponent implements OnInit {
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    protected readonly resizing: WritableSignal<boolean> = signal(false);
    public nextPane: InputSignal<NeoSplitterPaneComponent> = input.required<NeoSplitterPaneComponent>();
    public orientation: InputSignal<Orientation> = input.required<Orientation>();
    public previousPane: InputSignal<NeoSplitterPaneComponent> = input.required<NeoSplitterPaneComponent>();

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
                        filter(event => !(event.target instanceof HTMLButtonElement)),
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
        // if (this.nextPane().size() !== "1fr") {
        this.nextPane().size.set(nextPaneSize);
        // }
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
