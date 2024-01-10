import { animate, style, transition, trigger } from "@angular/animations";
import { NgStyle } from "@angular/common";
import { Component, computed, Input, Signal, signal, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCaretDown, faCaretRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ImmutableSet } from "@mirei/ts-collections";
import { CheckBoxDirective } from "../../../../inputs/check-box/check-box.directive";
import { TreeNode } from "../../models/TreeNode";
import { TreeService } from "../../services/tree.service";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-sub-tree",
    standalone: true,
    imports: [TreeNodeComponent, FaIconComponent, NgStyle, CheckBoxDirective, FormsModule],
    templateUrl: "./sub-tree.component.html",
    styleUrl: "./sub-tree.component.scss",
    animations: [
        trigger("nodeExpand", [
            transition(":enter", [
                style({ height: "0px", opacity: 0 }),
                animate("0.15s ease-out", style({ height: "*", opacity: 1 }))
            ]),
            transition(":leave", [animate("0.15s ease-out", style({ height: "0px", opacity: 0 }))])
        ])
    ]
})
export class SubTreeComponent<T> {
    protected readonly collapsedIcon: IconDefinition = faCaretRight;
    protected readonly expandedIcon: IconDefinition = faCaretDown;
    protected readonly nodeSet: WritableSignal<ImmutableSet<TreeNode<T>>> = signal(ImmutableSet.create());
    protected readonly paddingLeft: Signal<number> = computed(() => {
        const depth = this.subTreeDepth();
        return depth === 0 ? 0 : 24;
    });
    protected readonly parentNode: WritableSignal<TreeNode<T> | null> = signal(null);
    protected readonly subTreeDepth: WritableSignal<number> = signal(0);

    @Input({ required: true })
    public set depth(depth: number) {
        this.subTreeDepth.set(depth);
    }

    @Input({ required: true })
    public set nodes(nodes: Iterable<TreeNode<T>>) {
        this.nodeSet.set(ImmutableSet.create(nodes));
    }

    @Input({ required: true })
    public set parent(parent: TreeNode<T> | null) {
        this.parentNode.set(parent);
    }

    public constructor(protected readonly treeService: TreeService<T>) {}

    public onCheckStateChange(node: TreeNode<T>, checked: boolean): void {
        this.treeService.setNodeCheck(node, checked);
        this.treeService.nodeCheck$.next({ node, checked });
    }

    public onExpandStateChange(node: TreeNode<T>, expanded: boolean): void {
        this.treeService.setNodeExpand(node, expanded);
        this.treeService.nodeExpand$.next({ node, expanded });
    }
}
