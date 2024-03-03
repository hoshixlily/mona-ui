import { NgClass } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit,
    Signal
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faCaretDown,
    faCaretLeft,
    faCaretRight,
    faCaretUp,
    faEllipsisH,
    faEllipsisV,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { fromEvent } from "rxjs";
import { Orientation } from "../../../../models/Orientation";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";

@Component({
    selector: "mona-splitter-resizer",
    templateUrl: "./splitter-resizer.component.html",
    styleUrls: ["./splitter-resizer.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, FontAwesomeModule]
})
export class SplitterResizerComponent implements OnInit {
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #resizing: boolean = false;
    protected readonly horizontalCollapseNextIcon: IconDefinition = faCaretRight;
    protected readonly horizontalCollapsePreviousIcon: IconDefinition = faCaretLeft;
    protected readonly horizontalResizeIcon: IconDefinition = faEllipsisV;
    protected readonly nextPane: Signal<SplitterPaneComponent | null> = computed(() => {
        const previousPane = this.previousPane();
        const panes = this.panes();
        const index = panes.indexOf(previousPane);
        return index === -1 ? null : panes[index + 1];
    });
    protected readonly verticalCollapseNextIcon: IconDefinition = faCaretDown;
    protected readonly verticalCollapsePreviousIcon: IconDefinition = faCaretUp;
    protected readonly verticalResizeIcon: IconDefinition = faEllipsisH;

    public nextResizer: InputSignal<SplitterResizerComponent | null> = input<SplitterResizerComponent | null>(null);
    public orientation: InputSignal<Orientation> = input<Orientation>("horizontal");
    public panes: InputSignal<ReadonlyArray<SplitterPaneComponent>> = input<ReadonlyArray<SplitterPaneComponent>>([]);
    public previousPane: InputSignal<SplitterPaneComponent> = input.required<SplitterPaneComponent>();
    public previousResizer: InputSignal<SplitterResizerComponent | null> = input<SplitterResizerComponent | null>(null);

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public toggle(position: "previous" | "next"): void {
        const previousPane = this.previousPane();
        const nextPane = this.nextPane();
        if (previousPane.collapsed() && nextPane?.collapsed()) {
            return;
        }
        if (position === "previous") {
            if (!previousPane.collapsed()) {
                if (!nextPane?.collapsed()) {
                    previousPane.setCollapsed(true);
                    if (!previousPane.isStatic() && nextPane && nextPane?.isStatic()) {
                        nextPane.isStatic.set(false);
                    }
                } else {
                    if (nextPane) {
                        nextPane.setCollapsed(false);
                    }
                    if (previousPane.uid === this.panes()[0].uid && previousPane.paneSize() != null) {
                        previousPane.isStatic.set(true);
                    }
                }
            } else if (nextPane && nextPane.collapsed()) {
                nextPane.setCollapsed(false);
            }
        } else {
            if (nextPane && !nextPane.collapsed()) {
                if (!previousPane.collapsed()) {
                    nextPane.setCollapsed(true);
                    if (!nextPane.isStatic() && this.previousPane().isStatic()) {
                        previousPane.isStatic.set(false);
                    }
                } else {
                    previousPane.setCollapsed(false);
                    if (nextPane.uid === this.panes()[this.panes().length - 1].uid && nextPane.paneSize() != null) {
                        nextPane.isStatic.set(true);
                    }
                }
            } else if (previousPane.collapsed()) {
                previousPane.setCollapsed(false);
            }
        }
    }

    private getPaneElements(): HTMLElement[] {
        return [
            document.querySelector(`[data-pid='${this.previousPane().uid}']`) as HTMLElement,
            document.querySelector(`[data-pid='${this.nextPane()?.uid}']`) as HTMLElement
        ];
    }

    private resize(event: MouseEvent): void {
        const [previousPaneElement, nextPaneElement] = this.getPaneElements();
        const rect = previousPaneElement.getBoundingClientRect();
        if (this.orientation() === "horizontal") {
            const totalSize = rect.width + nextPaneElement.getBoundingClientRect().width;
            const size =
                event.clientX - rect.left < 0
                    ? 0
                    : event.clientX - rect.left > totalSize
                      ? totalSize
                      : event.clientX - rect.left;
            this.previousPane().setSize(`${size}px`);
            if (this.nextPane()) {
                this.nextPane()?.setSize(`${totalSize - size}px`);
            }
        } else {
            const totalSize = rect.height + nextPaneElement.getBoundingClientRect().height;
            const size =
                event.clientY - rect.top < 0
                    ? 0
                    : event.clientY - rect.top > totalSize
                      ? totalSize
                      : event.clientY - rect.top;
            this.previousPane().setSize(`${size}px`);
            this.nextPane()?.setSize(`${totalSize - size}px`);
        }
    }

    private setSubscriptions(): void {
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "mousedown").subscribe(() => {
            this.#resizing = true;
            const mouseMoveSubscription = fromEvent<MouseEvent>(document, "mousemove").subscribe(event => {
                event.stopPropagation();
                event.preventDefault();
                if (!this.previousPane().resizable() || !this.nextPane()?.resizable()) {
                    return;
                }
                if (!this.previousPane().collapsed() && !this.nextPane()?.collapsed()) {
                    this.resize(event);
                }
            });
            const mouseUpSubscription = fromEvent<MouseEvent>(document, "mouseup").subscribe(() => {
                mouseMoveSubscription.unsubscribe();
                mouseUpSubscription.unsubscribe();
                this.#resizing = false;
            });
        });
    }
}
