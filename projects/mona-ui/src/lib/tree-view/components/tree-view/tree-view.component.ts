import { Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { Node } from "../../data/Node";
import { List } from "@mirei/ts-collections";
import { TreeViewService } from "../../services/tree-view.service";
import { TreeViewNodeTextTemplateDirective } from "../../directives/tree-view-node-text-template.directive";
import { Action } from "../../../utils/Action";
import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart } from "@angular/cdk/drag-drop";
import { DropPosition } from "../../data/DropPosition";
import { DropPositionChangeEvent } from "../../data/DropPositionChangeEvent";

@Component({
    selector: "mona-tree-view",
    templateUrl: "./tree-view.component.html",
    styleUrls: ["./tree-view.component.scss"],
    providers: [TreeViewService]
})
export class TreeViewComponent implements OnInit, OnChanges {
    private disabler?: Action<any, boolean> | string;
    private dragNode?: Node;
    private dropPosition?: DropPosition;
    private dropTargetNode?: Node;
    public dragging: boolean = false;

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

    public onNodeDragEnd(event: CdkDragEnd<Node>): void {
        this.dragging = false;
        this.dragNode = undefined;
        // console.log("drag end", this.dragNode);
    }

    public onNodeDragMove(event: CdkDragMove, node: Node): void {}

    public onNodeDragStart(event: CdkDragStart<Node>): void {
        this.dragging = true;
        this.dragNode = event.source.data;
        console.log("drag start", this.dragNode);
    }

    public onNodeDrop(event: CdkDragDrop<Node, Node, Node>): void {
        if (!event.isPointerOverContainer || !this.dropTargetNode) {
            // emit drop event
            return;
        }
        const draggedNode = event.item.data;
        if (this.dropTargetNode.uid === draggedNode.uid || this.dropTargetNode.isDescendantOf(draggedNode)) {
            return;
        }
        const oldParent = draggedNode.parent;
        if (oldParent) {
            if (this.dropTargetNode?.parent) {
                oldParent.nodes = oldParent.nodes.filter(node => node.uid !== draggedNode.uid);
                this.treeViewService.updateNodeCheckStatus(oldParent);
                if (this.dropPosition === "before") {
                    const index = this.dropTargetNode.parent.nodes.indexOf(this.dropTargetNode);
                    this.dropTargetNode.parent.nodes.splice(index, 0, draggedNode);
                    draggedNode.parent = this.dropTargetNode.parent;
                } else if (this.dropPosition === "after") {
                    const index = this.dropTargetNode.parent.nodes.indexOf(this.dropTargetNode);
                    this.dropTargetNode.parent.nodes.splice(index + 1, 0, draggedNode);
                    draggedNode.parent = this.dropTargetNode.parent;
                } else if (this.dropPosition === "inside") {
                    this.dropTargetNode.nodes.push(draggedNode);
                    draggedNode.parent = this.dropTargetNode;
                }
            } else {
                oldParent.nodes = oldParent.nodes.filter(node => node.uid !== draggedNode.uid);
                const index = this.treeViewService.nodeList.indexOf(oldParent);
                this.treeViewService.updateNodeCheckStatus(oldParent);
                if (this.dropPosition === "before") {
                    this.treeViewService.nodeList.splice(index, 0, draggedNode);
                    draggedNode.parent = undefined;
                } else if (this.dropPosition === "after") {
                    this.treeViewService.nodeList.splice(index + 1, 0, draggedNode);
                    draggedNode.parent = undefined;
                } else if (this.dropPosition === "inside") {
                    this.dropTargetNode.nodes.push(draggedNode);
                    draggedNode.parent = this.dropTargetNode;
                }
                this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
            }
        } else {
            this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
            if (this.dropPosition === "before") {
                const index = this.treeViewService.nodeList.indexOf(this.dropTargetNode);
                this.treeViewService.nodeList.splice(index, 0, draggedNode);
                draggedNode.parent = undefined;
            } else if (this.dropPosition === "after") {
                const index = this.treeViewService.nodeList.indexOf(this.dropTargetNode);
                this.treeViewService.nodeList.splice(index + 1, 0, draggedNode);
                draggedNode.parent = undefined;
            } else if (this.dropPosition === "inside") {
                this.dropTargetNode.nodes.push(draggedNode);
                draggedNode.parent = this.dropTargetNode;
            }
            this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
        }

        this.treeViewService.updateNodeCheckStatus(draggedNode);
        this.treeViewService.updateNodeCheckStatus(this.dropTargetNode);
        this.dragging = false;
    }

    public onNodeDropPositionChange(event: DropPositionChangeEvent): void {
        this.dropPosition = event.position;
        this.dropTargetNode = event.node;
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
