import { transition, trigger } from "@angular/animations";
import { FocusMonitor } from "@angular/cdk/a11y";
import { AsyncPipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChild,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    NgZone,
    OnInit,
    output,
    TemplateRef,
    untracked
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { asapScheduler, fromEvent, takeWhile, tap } from "rxjs";
import { TreeNodeTemplateDirective } from "../../directives/tree-node-template.directive";
import { NodeCheckEvent } from "../../models/NodeCheckEvent";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { NodeDragEvent } from "../../models/NodeDragEvent";
import { NodeDragStartEvent } from "../../models/NodeDragStartEvent";
import { NodeDropEvent } from "../../models/NodeDropEvent";
import { NodeSelectEvent } from "../../models/NodeSelectEvent";
import { TreeNode } from "../../models/TreeNode";
import { TreeService } from "../../services/tree.service";
import { SubTreeComponent } from "../sub-tree/sub-tree.component";
import { TreeDropHintComponent } from "../tree-drop-hint/tree-drop-hint.component";

@Component({
    selector: "mona-tree",
    imports: [SubTreeComponent, TreeDropHintComponent, AsyncPipe],
    templateUrl: "./tree.component.html",
    styleUrl: "./tree.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [trigger("nodeExpandParent", [transition(":enter", [])])],
    host: {
        "[class.mona-tree]": "true",
        "[attr.role]": "'tree'",
        "[attr.tabindex]": "0"
    }
})
export class TreeComponent<T> implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #focusMonitor: FocusMonitor = inject(FocusMonitor);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #zone: NgZone = inject(NgZone);

    protected readonly nodeCheck = output<NodeCheckEvent<T>>();
    protected readonly nodeClick = output<NodeClickEvent<T>>();
    protected readonly nodeDrag = output<NodeDragEvent<T>>();
    protected readonly nodeDragEnd = output<NodeDragStartEvent<T>>();
    protected readonly nodeDragStart = output<NodeDragStartEvent<T>>();
    protected readonly nodeDrop = output<NodeDropEvent<T>>();
    protected readonly nodeSelect = output<NodeSelectEvent<T>>();
    protected readonly treeService: TreeService<T> = inject(TreeService);
    protected readonly nodeTemplate = contentChild(TreeNodeTemplateDirective, { read: TemplateRef });

    public data = input<Iterable<T>>();

    public constructor() {
        effect(() => {
            const nodeTemplate = this.nodeTemplate() ?? null;
            untracked(() => {
                this.treeService.nodeTemplate.set(nodeTemplate);
            });
        });
        effect(() => {
            const data = this.data();
            untracked(() => {
                if (data != null) {
                    this.treeService.setData(data);
                }
            });
        });
    }

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
        const rect = this.#hostElementRef.nativeElement.getBoundingClientRect();
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
        this.#focusMonitor
            .monitor(this.#hostElementRef.nativeElement, true)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(origin => {
                if (origin) {
                    return;
                }
                asapScheduler.schedule(() => {
                    this.treeService.navigatedNode.set(null);
                });
            });
    }

    private setKeydownSubscription(): void {
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
            .pipe(
                tap(e => e.preventDefault()),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(event => {
                const navigatedNode = this.treeService.navigatedNode();
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    this.treeService.navigate("previous");
                } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    this.treeService.navigate("next");
                } else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    if (!navigatedNode || !navigatedNode.nodeItem.hasChildren) {
                        return;
                    }
                    const expanded = this.treeService.isExpanded(navigatedNode);
                    const disabled = this.treeService.isDisabled(navigatedNode);
                    if (!disabled && expanded) {
                        this.treeService.setNodeExpand(navigatedNode, false);
                    }
                    this.treeService.navigatedNode.set(navigatedNode);
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    if (!navigatedNode || !navigatedNode.nodeItem.hasChildren) {
                        return;
                    }
                    const expanded = this.treeService.isExpanded(navigatedNode);
                    const disabled = this.treeService.isDisabled(navigatedNode);
                    if (!disabled && !expanded) {
                        this.treeService.setNodeExpand(navigatedNode, true);
                    }
                } else if (event.key === " ") {
                    event.preventDefault();
                    if (!navigatedNode || this.treeService.isDisabled(navigatedNode)) {
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
                    event.preventDefault();
                    if (!navigatedNode || this.treeService.isDisabled(navigatedNode)) {
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
                        this.treeService.notifySelectionChange(navigatedNode);
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

    private setNodeDragSubscription(): void {
        this.treeService.nodeDrag$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeDrag.emit(event.dragEvent));
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
        this.setNodeDragEndSubscription();
        this.setNodeDragHandlerSubscription();
        this.setNodeDragStartSubscription();
        this.setNodeDragSubscription();
        this.setNodeDropSubscription();
        this.setNodeSelectSubscription();
    }
}
