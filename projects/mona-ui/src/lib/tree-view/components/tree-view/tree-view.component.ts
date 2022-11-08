import { Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { Node } from "../../data/Node";
import { List } from "@mirei/ts-collections";
import { TreeViewService } from "../../services/tree-view.service";
import { TreeViewNodeTextTemplateDirective } from "../../directives/tree-view-node-text-template.directive";
import { Action } from "../../../utils/Action";

@Component({
    selector: "mona-tree-view",
    templateUrl: "./tree-view.component.html",
    styleUrls: ["./tree-view.component.scss"],
    providers: [TreeViewService]
})
export class TreeViewComponent implements OnInit, OnChanges {
    private disabler?: Action<any, boolean> | string;

    @Input()
    public childrenField: string = "";

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public keyField: string = "";

    @Input()
    public set nodeDisabler(nodeDisabler: Action<any, boolean> | string) {
        this.disabler = nodeDisabler;
        this.updateDisabledState();
    }

    @ContentChild(TreeViewNodeTextTemplateDirective, { read: TemplateRef })
    public nodeTextTemplate?: TemplateRef<never> | null = null;

    @Input()
    public textField: string = "";

    public constructor(public readonly treeViewService: TreeViewService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["data"] && !changes["data"].isFirstChange()) {
            this.prepareNodeList();
        }
    }

    public ngOnInit(): void {
        if (!this.keyField) {
            throw new Error(
                "mona-tree-view: keyField is required. (keyField is a field that is unique for each node.)"
            );
        }
        this.prepareNodeList();
    }

    public nodeTrackBy(index: number, item: Node): string {
        return item.key;
    }

    private prepareNodeList(): void {
        this.treeViewService.nodeList = [];
        this.treeViewService.viewNodeList = [];
        this.treeViewService.nodeDictionary.clear();
        this.prepareNodeListRecursively(this.data, undefined, this.treeViewService.nodeList);
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        this.updateDisabledState();
        this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
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

    private updateDisabledState(): void {
        if (this.disabler) {
            const disabler = TreeViewService.getNodeDisablerAction(this.disabler);
            for (const node of this.treeViewService.nodeDictionary.values()) {
                node.disabled = disabler(node.data);
            }
        }
    }
}
