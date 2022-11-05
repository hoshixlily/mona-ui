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
    }

    public onExpandToggle(event: MouseEvent): void {
        this.node.expanded = !this.node.expanded;
    }
}
