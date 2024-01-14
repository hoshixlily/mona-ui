import { transition, trigger } from "@angular/animations";
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    NgZone,
    OnInit,
    Output,
    Signal,
    TemplateRef
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { fromEvent, takeWhile } from "rxjs";
import { TreeNodeTemplateDirective } from "../../directives/tree-node-template.directive";
import { DropPositionChangeEvent } from "../../models/DropPositionChangeEvent";
import { NodeCheckEvent } from "../../models/NodeCheckEvent";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { NodeDragEvent } from "../../models/NodeDragEvent";
import { NodeDragStartEvent } from "../../models/NodeDragStartEvent";
import { NodeDropEvent } from "../../models/NodeDropEvent";
import { NodeItem } from "../../models/NodeItem";
import { NodeSelectEvent } from "../../models/NodeSelectEvent";
import { TreeNode } from "../../models/TreeNode";
import { TreeService } from "../../services/tree.service";
import { SubTreeComponent } from "../sub-tree/sub-tree.component";
import { TreeDropHintComponent } from "../tree-drop-hint/tree-drop-hint.component";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-tree",
    standalone: true,
    imports: [SubTreeComponent, TreeNodeComponent, NgTemplateOutlet, NgStyle, TreeDropHintComponent],
    templateUrl: "./tree.component.html",
    styleUrl: "./tree.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [trigger("nodeExpandParent", [transition(":enter", [])])]
})
export class TreeComponent<T> implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #zone: NgZone = inject(NgZone);

    @Input()
    public set data(value: Iterable<T>) {
        this.treeService.setData(value);
    }

    @Output()
    public nodeCheck: EventEmitter<NodeCheckEvent<T>> = new EventEmitter();

    @Output()
    public nodeClick: EventEmitter<NodeClickEvent<T>> = new EventEmitter();

    @Output()
    public nodeDrag: EventEmitter<NodeDragEvent<T>> = new EventEmitter();

    @Output()
    public nodeDragEnd: EventEmitter<NodeDragStartEvent<T>> = new EventEmitter();

    @Output()
    public nodeDragStart: EventEmitter<NodeDragStartEvent<T>> = new EventEmitter();

    @Output()
    public nodeDrop: EventEmitter<NodeDropEvent<T>> = new EventEmitter();

    @ContentChild(TreeNodeTemplateDirective, { read: TemplateRef })
    public set nodeTemplate(value: TemplateRef<NodeItem<T>>) {
        this.treeService.nodeTemplate.set(value);
    }

    @Output()
    public nodeSelect: EventEmitter<NodeSelectEvent<T>> = new EventEmitter();

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        protected readonly treeService: TreeService<T>
    ) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private handleMouseMove(): void {
        this.#zone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(document, "mousemove")
                .pipe(
                    takeUntilDestroyed(this.#destroyRef),
                    takeWhile(() => this.treeService.dragging())
                )
                .subscribe(event => {
                    if (this.isMouseOutsideTree(event)) {
                        this.treeService.dropPositionChange$.next({
                            targetNode: null,
                            position: "outside"
                        });
                        return;
                    }
                    const element = event.target as HTMLElement;
                    const closest = element.closest("li");
                    if (!closest) {
                        return;
                    }
                    const nodeUid = closest?.getAttribute("data-uid");
                    if (!nodeUid) {
                        return;
                    }
                    const node = this.treeService.getNodeByUid(nodeUid);
                    if (!node) {
                        return;
                    }
                    const nodeElement = closest.querySelector("mona-tree-node");
                    if (!nodeElement) {
                        return;
                    }
                    this.notifyDropPositionChange(event, nodeElement, node);
                });
        });
    }

    private isMouseOutsideTree(event: MouseEvent): boolean {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        return event.clientY < rect.top || event.clientY > rect.bottom;
    }

    private notifyDropPositionChange(event: MouseEvent, nodeElement: Element, node: TreeNode<T>): void {
        const rect = nodeElement.getBoundingClientRect();
        if (event.clientY > rect.top && event.clientY - rect.top <= 8) {
            this.treeService.dropPositionChange$.next({
                targetNode: node,
                position: "before"
            });
        } else if (event.clientY < rect.bottom && rect.bottom - event.clientY <= 8) {
            this.treeService.dropPositionChange$.next({
                targetNode: node,
                position: "after"
            });
        } else if (event.clientY < rect.top || event.clientY > rect.bottom) {
            this.treeService.dropPositionChange$.next({
                targetNode: null,
                position: "outside"
            });
        } else {
            this.treeService.dropPositionChange$.next({
                targetNode: node,
                position: "inside"
            });
        }
    }

    private setFocusSubscription(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                this.treeService.navigatedNode.set(this.treeService.nodeSet().firstOrDefault());
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                this.treeService.navigatedNode.set(null);
            });
    }

    private setKeydownSubscription(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                const navigatedNode = this.treeService.navigatedNode();
                if (event.key === "ArrowUp") {
                    this.treeService.navigate("previous");
                } else if (event.key === "ArrowDown") {
                    this.treeService.navigate("next");
                } else if (event.key === "ArrowLeft") {
                    if (navigatedNode && this.treeService.isExpanded(navigatedNode)) {
                        this.treeService.setNodeExpand(navigatedNode, false);
                    }
                } else if (event.key === "ArrowRight") {
                    if (navigatedNode && !this.treeService.isExpanded(navigatedNode)) {
                        this.treeService.setNodeExpand(navigatedNode, true);
                    }
                } else if (event.key === " ") {
                    if (!navigatedNode) {
                        return;
                    }
                    if (this.treeService.isDisabled(navigatedNode)) {
                        return;
                    }
                    const nodeCheckEvent = new NodeCheckEvent(navigatedNode, event);
                    this.treeService.nodeCheck$.next(nodeCheckEvent);
                    if (!nodeCheckEvent.isDefaultPrevented()) {
                        const newCheckState = !this.treeService.isChecked(navigatedNode);
                        this.treeService.setNodeCheck(navigatedNode, newCheckState);
                        this.treeService.nodeCheckChange$.next({
                            node: navigatedNode,
                            checked: newCheckState
                        });
                    }
                } else if (event.key === "Enter") {
                    if (!navigatedNode) {
                        return;
                    }
                    if (this.treeService.isDisabled(navigatedNode)) {
                        return;
                    }
                    const nodeSelectEvent = new NodeSelectEvent(navigatedNode, event);
                    this.treeService.nodeSelect$.next(nodeSelectEvent);
                    if (!nodeSelectEvent.isDefaultPrevented()) {
                        this.treeService.setNodeSelect(navigatedNode, !this.treeService.isSelected(navigatedNode));
                        this.treeService.nodeSelectChange$.next({
                            node: navigatedNode,
                            selected: this.treeService.isSelected(navigatedNode)
                        });
                    }
                }
            });
    }

    private setNodeCheckSubscription(): void {
        this.treeService.nodeCheck$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeCheck.emit(event));
    }

    private setNodeClickSubscription(): void {
        this.treeService.nodeClick$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeClick.emit(event));
    }

    private setNodeDragSubscription(): void {
        this.treeService.nodeDrag$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeDrag.emit(event));
    }

    private setNodeDragEndSubscription(): void {
        this.treeService.nodeDragEnd$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeDragEnd.emit(event));
    }

    private setNodeDragHandlerSubscription(): void {
        this.treeService.dragging$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(dragging => {
            if (!dragging) {
                return;
            }
            this.handleMouseMove();
        });
    }

    private setNodeDragStartSubscription(): void {
        this.treeService.nodeDragStart$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeDragStart.emit(event));
    }

    private setNodeDropSubscription(): void {
        this.treeService.nodeDrop$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeDrop.emit(event));
    }

    private setNodeSelectSubscription(): void {
        this.treeService.nodeSelect$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeSelect.emit(event));
    }

    private setSubscriptions(): void {
        this.setFocusSubscription();
        this.setKeydownSubscription();
        this.setNodeCheckSubscription();
        this.setNodeClickSubscription();
        this.setNodeDragSubscription();
        this.setNodeDragEndSubscription();
        this.setNodeDragHandlerSubscription();
        this.setNodeDragStartSubscription();
        this.setNodeDropSubscription();
        this.setNodeSelectSubscription();
    }
}
