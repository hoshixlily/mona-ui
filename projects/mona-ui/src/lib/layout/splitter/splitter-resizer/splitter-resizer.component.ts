import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    QueryList,
    SimpleChanges
} from "@angular/core";
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
import { Orientation } from "../../../models/Orientation";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgClass, NgIf } from "@angular/common";

@Component({
    selector: "mona-splitter-resizer",
    templateUrl: "./splitter-resizer.component.html",
    styleUrls: ["./splitter-resizer.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgIf, FontAwesomeModule]
})
export class SplitterResizerComponent implements OnInit, OnChanges {
    public readonly horizontalCollapseNextIcon: IconDefinition = faCaretRight;
    public readonly horizontalCollapsePreviousIcon: IconDefinition = faCaretLeft;
    public readonly horizontalResizeIcon: IconDefinition = faEllipsisV;
    public readonly verticalCollapseNextIcon: IconDefinition = faCaretDown;
    public readonly verticalCollapsePreviousIcon: IconDefinition = faCaretUp;
    public readonly verticalResizeIcon: IconDefinition = faEllipsisH;
    public resizing: boolean = false;

    public nextPane!: SplitterPaneComponent;

    @Input()
    public nextResizer: SplitterResizerComponent | null = null;

    @Input()
    public orientation: Orientation = "horizontal";

    @Input()
    public previousPane!: SplitterPaneComponent;

    @Input()
    public panes: QueryList<SplitterPaneComponent> = new QueryList<SplitterPaneComponent>();

    @Input()
    public previousResizer: SplitterResizerComponent | null = null;

    public constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly cdr: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && (changes["panes"] || changes["pane"])) {
            const index = this.panes.toArray().indexOf(this.previousPane);
            if (index !== -1) {
                this.nextPane = this.panes.toArray()[index + 1];
            }
        }
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public toggle(position: "previous" | "next"): void {
        if (this.previousPane.collapsed && this.nextPane?.collapsed) {
            return;
        }
        if (position === "previous") {
            if (!this.previousPane.collapsed) {
                if (!this.nextPane.collapsed) {
                    this.previousPane.setCollapsed(true);
                    if (!this.previousPane.isStatic && this.nextPane.isStatic) {
                        this.nextPane.isStatic = false;
                    }
                } else {
                    this.nextPane.setCollapsed(false);
                    if (this.previousPane.uid === this.panes.first.uid && this.previousPane.paneSize() != null) {
                        this.previousPane.isStatic = true;
                    }
                }
            } else if (this.nextPane.collapsed) {
                this.nextPane.setCollapsed(false);
            }
        } else {
            if (!this.nextPane?.collapsed) {
                if (!this.previousPane.collapsed) {
                    this.nextPane.setCollapsed(true);
                    if (!this.nextPane.isStatic && this.previousPane.isStatic) {
                        this.previousPane.isStatic = false;
                    }
                } else {
                    this.previousPane.setCollapsed(false);
                    if (this.nextPane.uid === this.panes.last.uid && this.nextPane.paneSize() != null) {
                        this.nextPane.isStatic = true;
                    }
                }
            } else if (this.previousPane.collapsed) {
                this.previousPane.setCollapsed(false);
            }
        }
    }

    private getPaneElements(): HTMLElement[] {
        return [
            document.querySelector(`[data-pid='${this.previousPane.uid}']`) as HTMLElement,
            document.querySelector(`[data-pid='${this.nextPane?.uid}']`) as HTMLElement
        ];
    }

    private resize(event: MouseEvent): void {
        const [previousPaneElement, nextPaneElement] = this.getPaneElements();
        const rect = previousPaneElement.getBoundingClientRect();
        if (this.orientation === "horizontal") {
            const totalSize = rect.width + nextPaneElement.getBoundingClientRect().width;
            const size =
                event.clientX - rect.left < 0
                    ? 0
                    : event.clientX - rect.left > totalSize
                    ? totalSize
                    : event.clientX - rect.left;
            this.previousPane.setSize(`${size}px`);
            this.nextPane.setSize(`${totalSize - size}px`);
        } else {
            const totalSize = rect.height + nextPaneElement.getBoundingClientRect().height;
            const size =
                event.clientY - rect.top < 0
                    ? 0
                    : event.clientY - rect.top > totalSize
                    ? totalSize
                    : event.clientY - rect.top;
            this.previousPane.setSize(`${size}px`);
            this.nextPane.setSize(`${totalSize - size}px`);
        }
    }

    private setSubscriptions(): void {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown").subscribe(event => {
            this.resizing = true;
            const mouseMoveSubscription = fromEvent<MouseEvent>(document, "mousemove").subscribe(event => {
                event.stopPropagation();
                event.preventDefault();
                if (!this.previousPane.resizable || !this.nextPane.resizable) {
                    return;
                }
                if (!this.previousPane.collapsed && !this.nextPane.collapsed) {
                    this.resize(event);
                }
            });
            const mouseUpSubscription = fromEvent<MouseEvent>(document, "mouseup").subscribe(event => {
                mouseMoveSubscription.unsubscribe();
                mouseUpSubscription.unsubscribe();
                this.resizing = false;
            });
        });
    }
}
