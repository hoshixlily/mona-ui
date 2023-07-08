import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from "@angular/core";
import { Node } from "../../data/Node";
import { faCaretRight, faChevronDown, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TreeViewService } from "../../services/tree-view.service";
import { DropPosition } from "../../data/DropPosition";
import { DropPositionChangeEvent } from "../../data/DropPositionChangeEvent";
import { NodeClickEvent } from "../../data/NodeClickEvent";
import { of, Subject, switchMap, takeUntil } from "rxjs";
import { Highlightable } from "@angular/cdk/a11y";

@Component({
    selector: "mona-tree-view-node",
    templateUrl: "./tree-view-node.component.html",
    styleUrls: ["./tree-view-node.component.scss"]
})
export class TreeViewNodeComponent implements OnInit, OnDestroy, Highlightable {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    public readonly click$: Subject<MouseEvent> = new Subject<MouseEvent>();
    public readonly collapseIcon: IconDefinition = faChevronDown;
    public readonly dropMagnetIcon: IconDefinition = faCaretRight;
    public readonly expandIcon: IconDefinition = faChevronRight;
    public dropMagnetVisible: boolean = false;
    public dropPosition?: DropPosition;

    @Input()
    public dragging: boolean = false;

    @Output()
    public dropPositionChange: EventEmitter<DropPositionChangeEvent> = new EventEmitter<DropPositionChangeEvent>();

    @Input()
    public node!: Node;

    @Output()
    public nodeClick: EventEmitter<NodeClickEvent> = new EventEmitter<NodeClickEvent>();

    @Output()
    public nodeDoubleClick: EventEmitter<NodeClickEvent> = new EventEmitter<NodeClickEvent>();

    @Output()
    public nodeSelect: EventEmitter<Node> = new EventEmitter<Node>();

    @Input()
    public nodeTextTemplate?: TemplateRef<never> | null = null;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        public readonly treeViewService: TreeViewService
    ) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onCheckToggle(checked: boolean): void {
        this.treeViewService.toggleNodeCheck(this.node, checked);
    }

    public onExpandToggle(event: MouseEvent): void {
        this.treeViewService.toggleNodeExpand(this.node);
    }

    public onMouseEnter(event: MouseEvent): void {
        if (!this.dragging) {
            return;
        }
        this.dropMagnetVisible = true;
    }

    public onMouseLeave(event: MouseEvent): void {
        this.dropMagnetVisible = false;
        this.dropPosition = undefined;
        if (!this.dragging) {
            return;
        }
    }

    public onMouseMove(event: MouseEvent): void {
        if (!this.dragging) {
            return;
        }
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        let node: Node | undefined;
        if (event.clientY > rect.top && event.clientY - rect.top <= 5) {
            this.dropPosition = "before";
            node = this.node;
        } else if (event.clientY < rect.bottom && rect.bottom - event.clientY <= 5) {
            this.dropPosition = "after";
            node = this.node;
        } else if (event.clientY <= rect.top || event.clientY >= rect.bottom) {
            this.dropPosition = undefined;
            node = undefined;
        } else {
            this.dropPosition = "inside";
            node = this.node;
        }
        if (this.dropPosition) {
            this.dropPositionChange.emit({
                position: this.dropPosition,
                node
            });
        }
    }

    public onNodeDoubleClick(event: MouseEvent): void {
        if (this.node.disabled) {
            return;
        }
        const clickEvent = new NodeClickEvent(this.node.getLookupItem(), event, "dblclick");
        this.nodeDoubleClick.emit(clickEvent);
    }

    public onNodeClick(event: MouseEvent, type: "click" | "contextmenu"): void {
        if (this.node.disabled) {
            return;
        }
        const clickEvent = new NodeClickEvent(this.node.getLookupItem(), event, type);
        this.nodeClick.emit(clickEvent);
        if (clickEvent.isDefaultPrevented()) {
            return;
        }
        if (event.type === "click") {
            this.treeViewService.toggleNodeSelection(this.node);
            this.nodeSelect.emit(this.node);
        }
    }

    public setActiveStyles(): void {
        this.node.focused.set(true);
    }

    public setInactiveStyles(): void {
        this.node.focused.set(false);
    }

    private setSubscriptions(): void {
        this.click$
            .pipe(
                takeUntil(this.componentDestroy$),
                // debounceTime(350),
                switchMap(event => of({ event, type: event.type }))
            )
            .subscribe(result => {
                if (result.type === "dblclick") {
                    this.onNodeDoubleClick(result.event);
                } else {
                    this.onNodeClick(result.event, "click");
                }
            });
    }
}
