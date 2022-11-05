import { Component, Input, OnInit } from "@angular/core";
import { TreeNode } from "../../data/TreeNode";
import { faChevronDown, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-tree-view-node",
    templateUrl: "./tree-view-node.component.html",
    styleUrls: ["./tree-view-node.component.scss"]
})
export class TreeViewNodeComponent implements OnInit {
    public readonly collapseIcon: IconDefinition = faChevronDown;
    public readonly expandIcon: IconDefinition = faChevronRight;

    @Input()
    public node!: TreeNode;

    public constructor() {}

    public ngOnInit(): void {}

    public onExpandNodeToggle(event: MouseEvent): void {
        this.node.expanded = !this.node.expanded;
    }
}
