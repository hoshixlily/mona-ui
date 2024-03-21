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
import { AsyncPipe, NgStyle } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    Input,
    InputSignal,
    signal,
    WritableSignal
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
    faArrowDown,
    faArrowsRotate,
    faArrowUp,
    faBan,
    faCaretDown,
    faCaretRight,
    faPlus,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { ImmutableSet } from "@mirei/ts-collections";
import { take } from "rxjs";
import { CheckBoxDirective } from "../../../../inputs/check-box/directives/check-box.directive";
import { NodeDragEndEvent } from "../../models/NodeDragEndEvent";
import { NodeDragEvent } from "../../models/NodeDragEvent";
import { NodeDragStartEvent } from "../../models/NodeDragStartEvent";
import { NodeDropEvent } from "../../models/NodeDropEvent";
import { TreeNode } from "../../models/TreeNode";
import { TreeService } from "../../services/tree.service";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-sub-tree",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TreeNodeComponent,
        FaIconComponent,
        NgStyle,
        CheckBoxDirective,
        FormsModule,
        CdkDropList,
        CdkDrag,
        CdkDragPreview,
        AsyncPipe
    ],
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
    protected readonly dropAfterIcon: IconDefinition = faArrowDown;
    protected readonly dropBeforeIcon: IconDefinition = faArrowUp;
    protected readonly dropInsideIcon: IconDefinition = faPlus;
    protected readonly dropNotAllowIcon: IconDefinition = faBan;
    protected readonly expandedIcon: IconDefinition = faCaretDown;
    protected readonly loadingIcon: IconDefinition = faArrowsRotate;
    protected readonly nodeSet: WritableSignal<ImmutableSet<TreeNode<T>>> = signal(ImmutableSet.create());
    protected readonly treeService: TreeService<T> = inject(TreeService);

    public depth: InputSignal<number> = input.required();
    public parent: InputSignal<TreeNode<T> | null> = input.required();

    @Input({ required: true })
    public set nodes(nodes: Iterable<TreeNode<T>>) {
        this.nodeSet.set(ImmutableSet.create(nodes));
    }

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
            const draggedElement = event.source.element.nativeElement.nextSibling as HTMLElement;
            draggedElement.style.top = `${10}px`;
            draggedElement.style.left = `${10}px`;
        }
        this.treeService.dropPositionChange$.pipe(take(1)).subscribe(e => {
            if (e == null) {
                return;
            }
            const nodeDragEvent = new NodeDragEvent(node, e.targetNode, event.event);
            this.treeService.nodeDrag$.next(nodeDragEvent);
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
            if (sourceNode === targetNode || e.position === "outside" || targetNode == null) {
                return;
            }
            const nodeDropEvent = new NodeDropEvent(sourceNode, targetNode, e.position, event.event);
            this.treeService.nodeDrop$.next(nodeDropEvent);
            if (nodeDropEvent.isDefaultPrevented()) {
                return;
            }
            if (e.position === "inside") {
                this.treeService.moveNode(sourceNode, targetNode, "inside");
            } else if (e.position === "before") {
                this.treeService.moveNode(sourceNode, targetNode, "before");
            } else if (e.position === "after") {
                this.treeService.moveNode(sourceNode, targetNode, "after");
            }
            this.treeService.dropPositionChange$.next(null);
            this.focusNode(sourceNode);
        });
    }

    private focusNode(node: TreeNode<T>): void {
        this.treeService.navigatedNode.set(node);
        const element = document.querySelector(`li[data-uid="${node.uid}"]`)?.closest(".mona-tree") as HTMLElement;
        if (element == null) {
            console.warn(`Cannot find element for node ${node.uid}`);
            return;
        }
        element.focus();
    }
}
