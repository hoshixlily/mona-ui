import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { Node } from "../../data/Node";
import { faChevronDown, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TreeViewService } from "../../services/tree-view.service";

@Component({
    selector: "mona-tree-view-node",
    templateUrl: "./tree-view-node.component.html",
    styleUrls: ["./tree-view-node.component.scss"]
})
export class TreeViewNodeComponent implements OnInit {
    public readonly collapseIcon: IconDefinition = faChevronDown;
    public readonly expandIcon: IconDefinition = faChevronRight;

    @Input()
    public node!: Node;

    @Input()
    public nodeTextTemplate?: TemplateRef<never> | null = null;

    public constructor(public readonly treeViewService: TreeViewService) {}

    public ngOnInit(): void {}

    public onCheckToggle(checked: boolean): void {
        if (this.treeViewService.checkableOptions?.checkMode === "single") {
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

    public onSelectToggle(event: MouseEvent): void {
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
    }
}
