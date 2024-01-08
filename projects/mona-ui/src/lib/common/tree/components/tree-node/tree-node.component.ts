import { Component, computed, Input, Signal, signal, WritableSignal } from "@angular/core";
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
            return "FF";
        }
        return this.treeService.getNodeText(node);
    });
    protected readonly treeNode: WritableSignal<TreeNode<T> | null> = signal(null);

    @Input({ required: true })
    public set node(node: TreeNode<T>) {
        this.treeNode.set(node);
    }

    public constructor(protected readonly treeService: TreeService<T>) {}
}
