import { Component, ContentChild, Input, OnInit, TemplateRef } from "@angular/core";
import { Node } from "../../data/Node";
import { List } from "@mirei/ts-collections";
import { TreeViewService } from "../../services/tree-view.service";
import { TreeViewNodeTextTemplateDirective } from "../../directives/tree-view-node-text-template.directive";

@Component({
    selector: "mona-tree-view",
    templateUrl: "./tree-view.component.html",
    styleUrls: ["./tree-view.component.scss"],
    providers: [TreeViewService]
})
export class TreeViewComponent implements OnInit {
    @Input()
    public childrenField: string = "";

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public keyField: string = "";

    @ContentChild(TreeViewNodeTextTemplateDirective, { read: TemplateRef })
    public nodeTextTemplate?: TemplateRef<never> | null = null;

    @Input()
    public textField: string = "";

    public constructor(public readonly treeViewService: TreeViewService) {}

    public ngOnInit(): void {
        if (!this.keyField) {
            throw new Error(
                "mona-tree-view: keyField is required. (keyField is a field that is unique for each node.)"
            );
        }
        this.prepareNodeList();
        this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
    }

    private prepareNodeList(): void {
        this.treeViewService.nodeList = [];
        this.treeViewService.viewNodeList = [];
        this.treeViewService.nodeDictionary.clear();
        this.prepareNodeListRecursively(this.data, undefined, this.treeViewService.nodeList);
    }

    private prepareNodeListRecursively(root: Iterable<any>, parentNode?: Node, childNodes?: any[]): void {
        const rootList = new List(root ?? []);
        if (rootList.length === 0) {
            return;
        }
        for (const dataItem of rootList) {
            const nodeId = dataItem[this.keyField];
            const node: Node = new Node<any>({
                key: nodeId,
                data: dataItem,
                checked: false,
                expanded: false,
                selected: false,
                text: dataItem[this.textField],
                nodes: [],
                parent: parentNode
            });
            if (this.childrenField) {
                this.prepareNodeListRecursively(dataItem[this.childrenField], node, node.nodes);
            }
            childNodes?.push(node);
            this.treeViewService.nodeDictionary.add(node.uid, node);
        }
    }
}
