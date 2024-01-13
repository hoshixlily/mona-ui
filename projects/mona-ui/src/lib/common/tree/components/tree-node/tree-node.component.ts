import { Component, computed, DestroyRef, inject, Input, Signal, signal, WritableSignal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { map, startWith, Subject, withLatestFrom } from "rxjs";
import { NodeCheckEvent } from "../../models/NodeCheckEvent";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { NodeSelectEvent } from "../../models/NodeSelectEvent";
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
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #dragging: Signal<boolean> = toSignal(this.treeService.dragging$, {
        initialValue: false
    });
    protected readonly treeNode: WritableSignal<TreeNode<T> | null> = signal(null);
    public readonly checkable: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return false;
        }
        return this.treeService.isCheckable(node);
    });
    public readonly checkboxCheck$: Subject<boolean> = new Subject<boolean>();
    public readonly checkboxClick$: Subject<MouseEvent> = new Subject<MouseEvent>();
    public readonly checked: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        this.#dragging();
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
        this.#dragging();
        if (node === null) {
            return false;
        }
        return this.treeService.isIndeterminate(node);
    });
    public readonly navigated: Signal<boolean> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return false;
        }
        return this.treeService.isNavigated(node);
    });
    public readonly nodeText: Signal<string> = computed(() => {
        const node = this.treeNode();
        if (node === null) {
            return "";
        }
        return this.treeService.getNodeText(node);
    });
    public readonly paddingLeft: Signal<number> = computed(() => {
        const node = this.treeNode();
        this.#dragging();
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

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onNodeClick(event: MouseEvent): void {
        const node = this.treeNode();
        if (node === null) {
            return;
        }
        const nodeClickEvent = this.notifyNodeClick(event);
        if (nodeClickEvent.isDefaultPrevented()) {
            return;
        }
        const nodeSelectEvent = new NodeSelectEvent(node, event);
        this.treeService.nodeSelect$.next(nodeSelectEvent);
        if (nodeSelectEvent.isDefaultPrevented()) {
            return;
        }
        this.treeService.setNodeSelect(node, !this.selected());
        this.treeService.nodeSelectChange$.next({ node, selected: !this.selected() });
    }

    private notifyNodeClick(event: MouseEvent): NodeClickEvent<T> {
        const node = this.treeNode() as TreeNode<T>;
        const nodeClickEvent = new NodeClickEvent(node, event);
        this.treeService.nodeClick$.next(nodeClickEvent);
        return nodeClickEvent;
    }

    private setCheckboxClickSubscription(): void {
        this.checkboxClick$
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                map(event => {
                    const nodeCheckEvent = new NodeCheckEvent(this.treeNode() as TreeNode<T>, event);
                    this.treeService.nodeCheck$.next(nodeCheckEvent);
                    return nodeCheckEvent;
                }),
                withLatestFrom(
                    this.checkboxCheck$.pipe(startWith(this.treeService.isChecked(this.treeNode() as TreeNode<T>)))
                )
            )
            .subscribe(([event, checked]) => {
                if (event.isDefaultPrevented()) {
                    event.originalEvent?.preventDefault();
                    return;
                }
                this.treeService.setNodeCheck(this.treeNode() as TreeNode<T>, !checked);
                this.treeService.nodeCheckChange$.next({ node: this.treeNode() as TreeNode<T>, checked: !checked });
            });
    }

    private setSubscriptions(): void {
        this.setCheckboxClickSubscription();
    }
}
