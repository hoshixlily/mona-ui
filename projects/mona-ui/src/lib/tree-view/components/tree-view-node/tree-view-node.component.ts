import { Component, Input, OnInit } from "@angular/core";
import { TreeNode } from "../../data/TreeNode";

@Component({
    selector: "mona-tree-view-node",
    templateUrl: "./tree-view-node.component.html",
    styleUrls: ["./tree-view-node.component.scss"]
})
export class TreeViewNodeComponent implements OnInit {
    @Input()
    public node!: TreeNode;

    public constructor() {}
    public ngOnInit(): void {}
}
