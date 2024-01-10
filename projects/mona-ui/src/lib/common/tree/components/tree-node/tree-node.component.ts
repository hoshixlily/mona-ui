import { Component, computed, Input, Signal, signal, WritableSignal } from "@angular/core";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { TreeNode } from "../../models/TreeNode";
import { TreeService } from "../../services/tree.service";

@Component({
    selector: "mona-tree-node",
    standalone: true,
    imports: [],
    templateUrl: "./tree-node.component.html",
    styleUrl: "./tree-node.component.scss"
})
export class TreeNodeComponent<T> {
    protected readonly nodeText: Signal<string> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return "";
        }
        return this.treeService.getNodeText(node);
    });
    protected readonly treeNode: WritableSignal<TreeNode<T> | null> = signal(null);
    public readonly checked: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return false;
        }
        return this.treeService.isChecked(node);
    });
    public readonly expanded: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return true;
        }
        return this.treeService.isExpanded(node);
    });
    public readonly indeterminate: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return false;
        }
        return this.treeService.isIndeterminate(node);
    });
    public readonly paddingLeft: Signal<number> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return 0;
        }
        return node.children.length > 0 ? 0 : 24;
    });
    public readonly selected: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return false;
        }
        return this.treeService.isSelected(node);
    });

    @Input({ required: true })
    public set node(node: TreeNode<T>) {
        this.treeNode.set(node);
    }

    public constructor(protected readonly treeService: TreeService<T>) {}

    public onNodeClick(event: MouseEvent): void {
        const node = this.treeNode();
        if (node === null) {
            return;
        }
        const nodeClickEvent = this.notifyNodeClick(event);
        if (nodeClickEvent === null) {
            this.treeService.setNodeSelect(node, !this.selected());
            return;
        }
        if (!nodeClickEvent.isDefaultPrevented()) {
            this.treeService.setNodeSelect(node, !this.selected());
            this.treeService.nodeSelect$.next(node);
        }
    }

    private notifyNodeClick(event: MouseEvent): NodeClickEvent<T> | null {
        const node = this.treeNode();
        if (node === null) {
            return null;
        }
        const nodeClickEvent = new NodeClickEvent(node, event);
        this.treeService.nodeClick$.next(nodeClickEvent);
        return nodeClickEvent;
    }
}
