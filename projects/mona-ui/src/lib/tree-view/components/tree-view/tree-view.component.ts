import { Component, Input, OnInit } from "@angular/core";
import { TreeNode } from "../../data/TreeNode";
import { Dictionary, List } from "@mirei/ts-collections";

@Component({
    selector: "mona-tree-view",
    templateUrl: "./tree-view.component.html",
    styleUrls: ["./tree-view.component.scss"]
})
export class TreeViewComponent implements OnInit {
    private nodeDictionary: Dictionary<string, TreeNode> = new Dictionary<string, TreeNode>();
    public nodeList: TreeNode[] = [];
    public viewNodeList: TreeNode[] = [];

    @Input()
    public childrenField: string = "";

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public keyField: string = "";

    @Input()
    public textField: string = "";

    public constructor() {}
    public ngOnInit(): void {
        this.prepareNodeList();
        this.viewNodeList = [...this.nodeList];
    }

    private prepareNodeList(): void {
        this.nodeList = [];
        this.viewNodeList = [];
        this.prepareNodeListRecursively(this.data, undefined, this.nodeList);
    }

    private prepareNodeListRecursively(root: Iterable<any>, parentNode?: TreeNode, childNodes?: any[]): void {
        const rootList = new List(root ?? []);
        if (rootList.length === 0) {
            return;
        }
        for (const [dx, dataItem] of rootList.entries()) {
            const nodeId = dataItem[this.keyField];
            const node: TreeNode = new TreeNode<any>({
                id: nodeId,
                data: dataItem,
                checked: false,
                expanded: false,
                selected: false,
                text: dataItem[this.textField],
                nodes: []
            });
            if (this.childrenField) {
                this.prepareNodeListRecursively(dataItem[this.childrenField], node, node.nodes);
            }
            childNodes?.push(node);
            this.nodeDictionary.add(node.uid, node);
        }
    }
}
