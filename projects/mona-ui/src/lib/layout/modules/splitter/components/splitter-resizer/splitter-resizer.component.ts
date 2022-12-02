import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges } from "@angular/core";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { Orientation } from "../../data/Orientation";
import {
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faEllipsisH,
    faEllipsisV,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-splitter-resizer",
    templateUrl: "./splitter-resizer.component.html",
    styleUrls: ["./splitter-resizer.component.scss"]
})
export class SplitterResizerComponent implements OnInit, OnChanges {
    public readonly horizontalCollapseNextIcon: IconDefinition = faChevronRight;
    public readonly horizontalCollapsePreviousIcon: IconDefinition = faChevronLeft;
    public readonly horizontalExpandNextIcon: IconDefinition = faChevronLeft;
    public readonly horizontalExpandPreviousIcon: IconDefinition = faChevronRight;
    public readonly horizontalResizeIcon: IconDefinition = faEllipsisV;
    public readonly verticalCollapseNextIcon: IconDefinition = faChevronDown;
    public readonly verticalCollapsePreviousIcon: IconDefinition = faChevronUp;
    public readonly verticalExpandNextIcon: IconDefinition = faChevronUp;
    public readonly verticalExpandPreviousIcon: IconDefinition = faChevronDown;
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

    public constructor() {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && (changes["panes"] || changes["pane"])) {
            const index = this.panes.toArray().indexOf(this.previousPane);
            if (index !== -1) {
                this.nextPane = this.panes.toArray()[index + 1];
            }
        }
    }

    public ngOnInit(): void {}

    public test(): void {
        console.log([this.previousPane, this.nextPane, this.previousResizer, this.nextResizer]);
    }

    public toggle(position: "previous" | "next"): void {
        if (this.previousPane.collapsed && this.nextPane?.collapsed) {
            return;
        }
        if (position === "previous") {
            if (!this.previousPane.collapsed) {
                if (!this.nextPane.collapsed) {
                    this.previousPane.collapsed = true;
                } else {
                    this.nextPane.collapsed = false;
                }
            } else if (this.nextPane.collapsed) {
                this.nextPane.collapsed = false;
            }
        } else {
            if (!this.nextPane?.collapsed) {
                if (!this.previousPane.collapsed) {
                    this.nextPane.collapsed = true;
                    if (!this.nextPane.isStatic && this.previousPane.isStatic) {
                        this.previousPane.isStatic = false;
                    }
                } else {
                    this.previousPane.collapsed = false;
                }
            } else if (this.previousPane.collapsed) {
                this.previousPane.collapsed = false;
            }
        }
    }

    private getPaneElements(): HTMLElement[] {
        return [
            document.querySelector(`[data-pid='${this.previousPane.uid}']`) as HTMLElement,
            document.querySelector(`[data-pid='${this.nextPane?.uid}']`) as HTMLElement
        ];
    }
}
