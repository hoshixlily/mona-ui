import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { Node } from "../../data/Node";
import {
    faArrowDown,
    faArrowUp,
    faCaretRight,
    faChevronDown,
    faChevronRight,
    faPlus,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { TreeViewService } from "../../services/tree-view.service";
import { DropPosition } from "../../data/DropPosition";
import { DropPositionChangeEvent } from "../../data/DropPositionChangeEvent";

@Component({
    selector: "mona-tree-view-node",
    templateUrl: "./tree-view-node.component.html",
    styleUrls: ["./tree-view-node.component.scss"]
})
export class TreeViewNodeComponent implements OnInit {
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

    @Input()
    public nodeTextTemplate?: TemplateRef<never> | null = null;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        public readonly treeViewService: TreeViewService
    ) {}

    public ngOnInit(): void {}

    public onCheckToggle(checked: boolean): void {
        if (this.treeViewService.checkableOptions?.mode === "single") {
            this.treeViewService.uncheckAllNodes();
        }
        this.node.check({
            checked,
            checkChildren: this.treeViewService.checkableOptions?.checkChildren,
            checkParent: this.treeViewService.checkableOptions?.checkParents
        });
        const checkedKeys = this.treeViewService.nodeDictionary
            .where(n => n.value.checked)
            .select(n => n.value.key)
            .toArray();
        this.treeViewService.checkedKeysChange.emit(checkedKeys);
    }

    public onExpandToggle(event: MouseEvent): void {
        this.node.expand(!this.node.expanded, false);
        const expandedKeys = this.treeViewService.nodeDictionary
            .where(n => n.value.expanded)
            .select(n => n.value.key)
            .toArray();
        this.treeViewService.expandedKeysChange.emit(expandedKeys);
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

        if (event.clientY > rect.top && event.clientY - rect.top <= 5) {
            this.dropPosition = "before";
        } else if (event.clientY < rect.bottom && rect.bottom - event.clientY <= 5) {
            this.dropPosition = "after";
        } else if (event.clientY <= rect.top || event.clientY >= rect.bottom) {
            this.dropPosition = undefined;
        } else {
            this.dropPosition = "inside";
        }
        if (this.dropPosition) {
            this.dropPositionChange.emit({
                position: this.dropPosition,
                node: this.node
            });
        }
    }

    public onSelectToggle(event: MouseEvent): void {
        if (!this.treeViewService.selectableOptions.enabled) {
            return;
        }
        if (this.treeViewService.selectableOptions.childrenOnly && this.node.nodes.length > 0) {
            return;
        }
        if (this.node.selected) {
            this.node.setSelected(false);
            this.treeViewService.lastSelectedNode = undefined;
        } else {
            if (this.treeViewService.selectableOptions.mode === "single") {
                if (this.treeViewService.lastSelectedNode) {
                    this.treeViewService.lastSelectedNode.setSelected(false);
                }
            }
            this.node.setSelected(true);
            this.treeViewService.lastSelectedNode = this.node;
        }
        const selectedKeys = this.treeViewService.nodeDictionary
            .where(n => n.value.selected)
            .select(n => n.value.key)
            .toArray();
        this.treeViewService.selectedKeysChange.emit(selectedKeys);
    }
}
