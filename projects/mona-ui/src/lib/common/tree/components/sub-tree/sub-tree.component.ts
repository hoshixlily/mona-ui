import { Component, Input, signal, WritableSignal } from "@angular/core";
import { ImmutableSet } from "@mirei/ts-collections";
import { TreeNode } from "../../models/TreeNode";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-sub-tree",
    standalone: true,
    imports: [TreeNodeComponent],
    templateUrl: "./sub-tree.component.html",
    styleUrl: "./sub-tree.component.scss"
})
export class SubTreeComponent<T> {
    protected readonly nodeSet: WritableSignal<ImmutableSet<TreeNode<T>>> = signal(ImmutableSet.create());
    protected readonly subTreeDepth: WritableSignal<number> = signal(0);

    @Input({ required: true })
    public set depth(depth: number) {
        this.subTreeDepth.set(depth);
    }

    @Input({ required: true })
    public set nodes(nodes: Iterable<TreeNode<T>>) {
        this.nodeSet.set(ImmutableSet.create(nodes));
    }
}
