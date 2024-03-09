import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit,
    Signal
} from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faEllipsisH, faEllipsisV, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { filter, fromEvent, skipUntil, takeUntil, tap } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Orientation } from "../../../../models/Orientation";
import { SplitterPane } from "../../models/SplitterPane";

@Component({
    selector: "mona-neo-splitter-resizer",
    standalone: true,
    imports: [FaIconComponent, ButtonDirective],
    templateUrl: "./neo-splitter-resizer.component.html",
    styleUrl: "./neo-splitter-resizer.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-neo-splitter-resizer",
        "[class.mona-neo-splitter-resizer-horizontal]": "orientation()==='horizontal'",
        "[class.mona-neo-splitter-resizer-vertical]": "orientation()==='vertical'"
    }
})
export class NeoSplitterResizerComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #horizontalEllipsisIcon: IconDefinition = faEllipsisV;
    readonly #verticalEllipsisIcon: IconDefinition = faEllipsisH;
    protected readonly ellipsisIcon: Signal<IconDefinition> = computed(() => {
        const orientation = this.orientation();
        return orientation === "horizontal" ? this.#horizontalEllipsisIcon : this.#verticalEllipsisIcon;
    });
    public nextPane: InputSignal<SplitterPane> = input.required<SplitterPane>();
    public orientation: InputSignal<Orientation> = input.required<Orientation>();
    public previousPane: InputSignal<SplitterPane> = input.required<SplitterPane>();

    public ngOnInit(): void {
        this.setEvents();
    }

    public toggle(pos: "previous" | "next", event: MouseEvent): void {}

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
                        })
                    )
                ),
                takeUntil(
                    fromEvent<PointerEvent>(this.#hostElementRef.nativeElement, "pointerup").pipe(
                        tap(event => {
                            this.#hostElementRef.nativeElement.releasePointerCapture(event.pointerId);
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
