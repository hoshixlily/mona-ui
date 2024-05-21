import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    InputSignal,
    OnInit,
    Signal
} from "@angular/core";
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    templateUrl: "./tree-node.component.html",
    styleUrl: "./tree-node.component.scss"
})
export class TreeNodeComponent<T> implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #dragging: Signal<boolean> = toSignal(this.treeService.dragging$, {
        initialValue: false
    });
    public readonly checkable: Signal<boolean> = computed(() => {
        const node = this.node();
        if (node === null) {
            return false;
        }
        return this.treeService.isCheckable(node);
    });
    public readonly checkboxCheck$: Subject<boolean> = new Subject<boolean>();
    public readonly checkboxClick$: Subject<MouseEvent> = new Subject<MouseEvent>();
    public readonly checked: Signal<boolean> = computed(() => {
        const node = this.node();
        this.#dragging();
        if (node === null) {
            return false;
        }
        return this.treeService.isChecked(node);
    });
    public readonly disabled: Signal<boolean> = computed(() => {
        const node = this.node();
        if (node === null) {
            return false;
        }
        return this.treeService.isDisabled(node);
    });
    public readonly expandable: Signal<boolean> = computed(() => {
        const node = this.node();
        const expandableOptions = this.treeService.expandableOptions();
        const childrenSelector = this.treeService.children();
        const children = node?.children() ?? [];
        if (node === null) {
            return false;
        }
        if (!expandableOptions.enabled) {
            return false;
        }
        if (typeof childrenSelector === "function") {
            return this.treeService.hasChildren(node);
        }
        return children.length > 0;
    });
    public readonly expanded: Signal<boolean> = computed(() => {
        const node = this.node();
        if (node === null) {
            return true;
        }
        return this.treeService.isExpanded(node);
    });
    public readonly indeterminate: Signal<boolean> = computed(() => {
        const node = this.node();
        this.#dragging();
        if (node === null) {
            return false;
        }
        return this.treeService.isIndeterminate(node);
    });
    public readonly navigated: Signal<boolean> = computed(() => {
        const node = this.node();
        if (node === null) {
            return false;
        }
        return this.treeService.isNavigated(node);
    });
    public readonly nodeText: Signal<string> = computed(() => {
        const node = this.node();
        if (node === null) {
            return "";
        }
        return this.treeService.getNodeText(node);
    });
    public readonly selected: Signal<boolean> = computed(() => {
        const node = this.node();
        if (node === null) {
            return false;
        }
        return this.treeService.isSelected(node);
    });

    public depth: InputSignal<number> = input(0);
    public node: InputSignal<TreeNode<T> | null> = input<TreeNode<T> | null>(null);

    public constructor(protected readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onNodeClick(event: MouseEvent): void {
        const node = this.node();
        if (node === null) {
            return;
        }
        if (this.treeService.isDisabled(node)) {
            return;
        }
        if (event.type === "contextmenu") {
            event.preventDefault();
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
        this.treeService.notifySelectionChange(node);
    }

    public onNodeContextMenu(event: MouseEvent): void {
        const node = this.node();
        if (node === null) {
            return;
        }
        if (this.treeService.isDisabled(node)) {
            return;
        }
        this.treeService.navigatedNode.set(node);
    }

    private notifyNodeClick(event: MouseEvent): NodeClickEvent<T> {
        const node = this.node() as TreeNode<T>;
        const nodeClickEvent = new NodeClickEvent(node, event);
        this.treeService.nodeClick$.next(nodeClickEvent);
        return nodeClickEvent;
    }

    private setCheckboxClickSubscription(): void {
        this.checkboxClick$
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                map(event => {
                    const node = this.node() as TreeNode<T>;
                    const nodeCheckEvent = new NodeCheckEvent(node, event);
                    this.treeService.nodeCheck$.next(nodeCheckEvent);
                    return nodeCheckEvent;
                }),
                withLatestFrom(
                    this.checkboxCheck$.pipe(startWith(this.treeService.isChecked(this.node() as TreeNode<T>)))
                )
            )
            .subscribe(([event, checked]) => {
                const node = this.node() as TreeNode<T>;
                if (event.isDefaultPrevented()) {
                    event.originalEvent?.preventDefault();
                    return;
                }
                this.treeService.setNodeCheck(node, !checked);
                this.treeService.nodeCheckChange$.next({ node, checked: !checked });
            });
    }

    private setSubscriptions(): void {
        this.setCheckboxClickSubscription();
    }
}
