import { animate, style, transition, trigger } from "@angular/animations";
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragEnd,
    CdkDragMove,
    CdkDragPreview,
    CdkDragStart,
    CdkDropList
} from "@angular/cdk/drag-drop";
import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ImmutableSet } from "@mirei/ts-collections";
import { take } from "rxjs";
import { CheckBoxComponent } from "../../../../inputs/check-box/components/check-box/check-box.component";
import { NodeDragEndEvent } from "../../models/NodeDragEndEvent";
import { InternalNodeDragEvent, NodeDragEvent } from "../../models/NodeDragEvent";
import { NodeDragStartEvent } from "../../models/NodeDragStartEvent";
import { NodeDropEvent } from "../../models/NodeDropEvent";
import { TreeNode } from "../../models/TreeNode";
import { TreeService } from "../../services/tree.service";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-sub-tree",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TreeNodeComponent, FormsModule, CdkDropList, CdkDrag, CdkDragPreview, AsyncPipe, CheckBoxComponent],
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
    protected readonly treeService: TreeService<T> = inject(TreeService);

    public depth = input.required<number>();
    public nodes = input.required<ImmutableSet<TreeNode<T>>, Iterable<TreeNode<T>>>({
        transform: value => ImmutableSet.create(value)
    });
    public parent = input.required<TreeNode<T> | null>();

    public onExpandStateChange(node: TreeNode<T>): void {
        const expanded = this.treeService.isExpanded(node);
        if (!node.loaded() && !expanded) {
            this.treeService.loadNodeChildren(node);
        }
        this.treeService.setNodeExpand(node, !expanded);
        this.treeService.nodeExpand$.next({ node, expanded: !expanded });
    }

    public onNodeDragEnd(event: CdkDragEnd<TreeNode<T>>): void {
        const nodeDragEndEvent = new NodeDragEndEvent(event.source.data, event.event);
        this.treeService.nodeDragEnd$.next(nodeDragEndEvent);
        if (nodeDragEndEvent.isDefaultPrevented()) {
            return;
        }
        this.treeService.dragging.set(false);
    }

    public onNodeDragMove(event: CdkDragMove<TreeNode<T>>, node: TreeNode<T>): void {
        if (event.event) {
            const draggedElement = event.source.element.nativeElement.nextSibling;
            if (draggedElement) {
                const element = draggedElement as HTMLElement;
                element.style.top = `${10}px`;
                element.style.left = `${10}px`;
            }
        }
        this.treeService.dropPositionChange$.pipe(take(1)).subscribe(e => {
            if (e == null) {
                return;
            }
            const nodeDragEvent = new NodeDragEvent(node, e.targetNode, event.event);
            const dropAllowed =
                e.position !== "outside" &&
                e.targetNode != null &&
                e.targetNode !== node &&
                !e.targetNode.isDescendantOf(node);
            const internalNodeDragEvent = new InternalNodeDragEvent(nodeDragEvent, dropAllowed);
            this.treeService.nodeDrag$.next(internalNodeDragEvent);
        });
    }

    public onNodeDragStart(event: CdkDragStart<TreeNode<T>>): void {
        const node = event.source.data;
        if (this.treeService.isDisabled(node)) {
            event.event.stopPropagation();
            return;
        }
        const nodeDragStartEvent = new NodeDragStartEvent(node, event.event);
        this.treeService.nodeDragStart$.next(nodeDragStartEvent);
        if (nodeDragStartEvent.isDefaultPrevented()) {
            return;
        }
        this.treeService.dragging.set(true);
    }

    public onNodeDrop(event: CdkDragDrop<TreeNode<T>, unknown, TreeNode<T>>): void {
        this.treeService.dropPositionChange$.pipe(take(1)).subscribe(e => {
            if (e == null) {
                return;
            }
            const sourceNode = event.item.data;
            const targetNode = e.targetNode;
            if (
                targetNode === null ||
                sourceNode === targetNode ||
                targetNode.isDescendantOf(sourceNode) ||
                e.position === "outside"
            ) {
                return;
            }
            this.treeService.animationTemporarilyDisabled.set(true);
            const nodeDropEvent = new NodeDropEvent(sourceNode, targetNode, e.position, event.event);
            this.treeService.nodeDrop$.next(nodeDropEvent);
            if (nodeDropEvent.isDefaultPrevented()) {
                this.treeService.animationTemporarilyDisabled.set(false);
                return;
            }
            this.treeService.dropPositionChange$.next(null);
            this.focusNode(sourceNode);
            window.setTimeout(() => this.treeService.animationTemporarilyDisabled.set(false));
        });
    }

    private focusNode(node: TreeNode<T>): void {
        this.treeService.navigatedNode.set(node);
        const element = document.querySelector(`li[data-uid="${node.uid}"]`)?.closest(".mona-tree") as HTMLElement;
        if (element == null) {
            return;
        }
        element.focus();
    }
}
