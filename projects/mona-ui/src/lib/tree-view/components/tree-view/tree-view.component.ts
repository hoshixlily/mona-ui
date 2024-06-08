import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChild,
    effect,
    inject,
    input,
    OnInit,
    output,
    TemplateRef,
    untracked
} from "@angular/core";
import { Predicate, Selector } from "@mirei/ts-collections";
import { FilterInputComponent } from "../../../common/filter-input/components/filter-input/filter-input.component";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { TreeComponent } from "../../../common/tree/components/tree/tree.component";
import { TreeNodeTemplateDirective } from "../../../common/tree/directives/tree-node-template.directive";
import { DataStructure } from "../../../common/tree/models/DataStructure";
import { NodeClickEvent } from "../../../common/tree/models/NodeClickEvent";
import { TreeNode } from "../../../common/tree/models/TreeNode";
import { ChildrenSelector } from "../../../common/tree/models/TreeSelectors";
import { TreeService } from "../../../common/tree/services/tree.service";
import { TreeViewNodeTemplateDirective } from "../../directives/tree-view-node-template.directive";
import { TreeViewNodeTemplateContext } from "../../models/TreeViewNodeTemplateContext";

@Component({
    selector: "mona-tree-view",
    standalone: true,
    imports: [FilterInputComponent, TreeComponent, TreeNodeTemplateDirective, NgTemplateOutlet],
    templateUrl: "./tree-view.component.html",
    styleUrl: "./tree-view.component.scss",
    providers: [TreeService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-tree-view"
    }
})
export class TreeViewComponent<T> implements OnInit {
    protected readonly nodeTemplate = contentChild<
        TreeViewNodeTemplateDirective,
        TemplateRef<TreeViewNodeTemplateContext<T>>
    >(TreeViewNodeTemplateDirective, { read: TemplateRef });
    protected readonly treeService = inject(TreeService<T>);

    /**
     * The node click event emitter.
     */
    public readonly nodeClick = output<NodeClickEvent<T>>();

    /**
     * Whether to animate the tree.
     * If true, the tree will animate when expanding or collapsing nodes.
     */
    public animate = input<boolean>(true);

    /**
     * The children selector for the tree.
     * It can be either of the following:
     * - A string representing the property name of the children.
     * - A function that returns the children of a node.
     * - A function that returns an observable that emits the children of a node.
     * @param value The children selector for the tree.
     */
    public children = input<ChildrenSelector<T>>("");

    /**
     * The data for the tree.
     */
    public data = input<Iterable<T>>([]);

    /**
     * The predicate to determine if a node has children.
     * Required if the children selector is set to a function that returns an observable.
     * @param value The predicate to determine if a node has children.
     */
    public hasChildren = input<Predicate<T> | null>(null);

    /**
     * The field that represents the unique identifier of a node.
     * This is required if the data structure is set to "flat".
     */
    public idField = input<string>("");

    /**
     * The data structure of the tree.
     * It can be either of the following:
     * - "flat": The tree is a flat list of nodes.
     * - "hierarchical": The tree is a hierarchical structure.
     *
     * If the data structure is set to "flat", the following fields are required:
     * - {@link idField}
     * - {@link parentIdField}
     *
     * If the data structure is set to "hierarchical", the following fields are required:
     * - {@link children}
     * - {@link hasChildren}
     */
    public mode = input<DataStructure>("hierarchical");

    /**
     * The field that represents the parent identifier of a node.
     * This is required if the data structure is set to "flat".
     */
    public parentIdField = input<string>("");

    /**
     * The text field for the tree.
     * It can be either of the following:
     * - A string representing the property name of the text.
     * - A function that returns the text of a node.
     */
    public textField = input<string | Selector<T, string>>("");

    public constructor() {
        this.setDataStructureFields();
        this.setAnimationEffect();
    }

    public ngOnInit(): void {
        this.treeService.nodeClick = this.nodeClick;
    }

    public onFilterChange(event: FilterChangeEvent): void {
        if (this.treeService.filterChange) {
            this.treeService.filterChange.emit(event);
        }
        if (!event.isDefaultPrevented()) {
            this.treeService.filter$.next(event.filter);
        }
    }

    private setAnimationEffect(): void {
        effect(() => {
            const animate = this.animate();
            untracked(() => {
                this.treeService.setAnimationEnabled(animate);
            });
        });
    }

    private setDataStructureFields(): void {
        effect(() => {
            const mode = this.mode();
            if (mode === "flat") {
                this.setFlatDataStructureFields();
            } else if (mode === "hierarchical") {
                this.setHierarchicalDataStructureFields();
            }
            this.setGenericDataStructureFields(mode);
        });
    }

    private setFlatDataStructureFields(): void {
        const idField = this.idField();
        const parentIdField = this.parentIdField();
        untracked(() => {
            this.treeService.setFlatIdField(idField);
            this.treeService.setFlatParentIdField(parentIdField);
        });
    }

    private setGenericDataStructureFields(mode: DataStructure): void {
        const textField = this.textField();
        const data = this.data();
        untracked(() => {
            this.treeService.setTextField(textField);
            this.treeService.setDataStructure(mode);
            this.treeService.setData(data);
        });
    }

    private setHierarchicalDataStructureFields(): void {
        const childrenSelector = this.children();
        const hasChildren = this.hasChildren() as Predicate<TreeNode<T>>;
        untracked(() => {
            this.treeService.setChildrenSelector(childrenSelector);
            this.treeService.setHasChildrenPredicate(hasChildren);
        });
    }
}
