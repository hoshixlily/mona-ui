import {
    computed,
    DestroyRef,
    effect,
    inject,
    Injectable,
    OutputEmitterRef,
    Signal,
    signal,
    TemplateRef,
    untracked,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
    aggregate,
    contains,
    EnumerableSet,
    forEach,
    from,
    ImmutableDictionary,
    ImmutableSet,
    List,
    Predicate,
    Selector,
    sequenceEqual
} from "@mirei/ts-collections";
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    Observable,
    pairwise,
    ReplaySubject,
    Subject,
    take
} from "rxjs";
import { FilterChangeEvent } from "../../filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../../models/FilterableOptions";
import { CheckableOptions } from "../models/CheckableOptions";
import { DataStructure } from "../models/DataStructure";
import { DisableOptions } from "../models/DisableOptions";
import { DraggableOptions } from "../models/DraggableOptions";
import { DropPosition, DropPositionChangeEvent } from "../models/DropPositionChangeEvent";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { NodeCheckEvent } from "../models/NodeCheckEvent";
import { NodeClickEvent } from "../models/NodeClickEvent";
import { NodeDragEndEvent } from "../models/NodeDragEndEvent";
import { InternalNodeDragEvent, NodeDragEvent } from "../models/NodeDragEvent";
import { NodeDragStartEvent } from "../models/NodeDragStartEvent";
import { NodeDropEvent } from "../models/NodeDropEvent";
import { NodeItem } from "../models/NodeItem";
import { NodeSelectEvent } from "../models/NodeSelectEvent";
import { SelectableOptions } from "../models/SelectableOptions";
import { TreeNode } from "../models/TreeNode";
import { TreeNodeCheckEvent } from "../models/TreeNodeCheckEvent";
import { TreeNodeExpandEvent } from "../models/TreeNodeExpandEvent";
import { TreeNodeSelectEvent } from "../models/TreeNodeSelectEvent";
import { ChildrenSelector, NodeKeySelector } from "../models/TreeSelectors";

@Injectable()
export class TreeService<T> {
    readonly #checkedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private readonly data: WritableSignal<ImmutableSet<T>> = signal(ImmutableSet.create());
    private readonly filteredExpandedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    private readonly flatIdField: WritableSignal<string> = signal("");
    private readonly flatParentIdField: WritableSignal<string> = signal("");
    private readonly hasChildrenPredicate: WritableSignal<Predicate<any> | null> = signal(null);
    private readonly navigableNodes: Signal<ImmutableSet<TreeNode<T>>> = computed(() => {
        const flattenedNodes = TreeService.flatten(this.viewNodeSet());
        return flattenedNodes
            .where(n => n.parent === null || !this.isAnyParentCollapsed(n))
            .select(n => n)
            .orderBy(n => n.index)
            .toImmutableSet();
    });
    private readonly nodeDictionary: Signal<ImmutableDictionary<string, TreeNode<T>>> = computed(() => {
        const nodes = this.nodeSet();
        return this.createNodeDictionary(nodes);
    });
    private readonly structure: WritableSignal<DataStructure> = signal("hierarchical");
    private readonly unfilteredExpandedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly animationTemporarilyDisabled: WritableSignal<boolean> = signal(false);
    public readonly animationEnabled: WritableSignal<boolean> = signal(true);
    public readonly checkBy: WritableSignal<NodeKeySelector<T>> = signal(null);
    public readonly checkableOptions: WritableSignal<CheckableOptions> = signal({
        checkChildren: true,
        checkDisabledChildren: false,
        checkParents: true,
        childrenOnly: false,
        enabled: false,
        mode: "multiple"
    });
    public readonly checkedKeys$: Observable<ImmutableSet<any>> = toObservable(this.#checkedKeys);
    public readonly children: WritableSignal<ChildrenSelector<T>> = signal("");
    public readonly disableBy: WritableSignal<NodeKeySelector<T>> = signal(null);
    public readonly disableOptions: WritableSignal<DisableOptions> = signal({
        disableChildren: true,
        enabled: false
    });
    public readonly disabledKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly draggableOptions: WritableSignal<DraggableOptions> = signal({ enabled: false });
    public readonly dragging: WritableSignal<boolean> = signal(false);
    public readonly dragging$: Observable<boolean> = toObservable(this.dragging);
    public readonly dropPositionChange$: BehaviorSubject<DropPositionChangeEvent<T> | null> =
        new BehaviorSubject<DropPositionChangeEvent<T> | null>(null);
    public readonly expandBy: WritableSignal<NodeKeySelector<T>> = signal(null);
    public readonly expandableOptions: WritableSignal<ExpandableOptions> = signal({ enabled: false });
    public readonly expandedKeys: Signal<ImmutableSet<any>> = computed(() => {
        const filterText = this.filterText();
        if (filterText) {
            return this.filteredExpandedKeys();
        }
        return this.unfilteredExpandedKeys();
    });
    public readonly expandedKeys$: Observable<ImmutableSet<any>> = toObservable(this.expandedKeys);
    public readonly filterableOptions: WritableSignal<FilterableOptions> = signal({
        enabled: false,
        debounce: 0,
        caseSensitive: false,
        operator: "contains"
    });
    public readonly filter$: ReplaySubject<string> = new ReplaySubject<string>(1);
    public readonly filterPlaceholder: WritableSignal<string> = signal("");
    public readonly filterText: Signal<string> = toSignal(
        this.filter$.pipe(debounceTime(this.filterableOptions().debounce), distinctUntilChanged()),
        { initialValue: "" }
    );
    public readonly navigatedNode: WritableSignal<TreeNode<T> | null> = signal(null);
    public readonly nodeCheck$: Subject<NodeCheckEvent<T>> = new Subject();
    public readonly nodeCheckChange$: Subject<TreeNodeCheckEvent<T>> = new Subject();
    public readonly nodeClick$: Subject<NodeClickEvent<T>> = new Subject();
    public readonly nodeDrag$: Subject<InternalNodeDragEvent<T>> = new Subject();
    public readonly nodeDragEnd$: Subject<NodeDragEndEvent<T>> = new Subject();
    public readonly nodeDragStart$: Subject<NodeDragStartEvent<T>> = new Subject();
    public readonly nodeDrop$: Subject<NodeDropEvent<T>> = new Subject();
    public readonly nodeExpand$: Subject<TreeNodeExpandEvent<T>> = new Subject();
    public readonly nodeSelect$: Subject<NodeSelectEvent<T>> = new Subject();
    public readonly nodeSelectChange$: Subject<TreeNodeSelectEvent<T>> = new Subject();
    public readonly nodeSet: WritableSignal<ImmutableSet<TreeNode<T>>> = signal(ImmutableSet.create());
    public readonly nodeTemplate: WritableSignal<TemplateRef<any> | null> = signal(null);
    public readonly selectBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly selectableOptions: WritableSignal<SelectableOptions> = signal({
        childrenOnly: false,
        enabled: false,
        mode: "single",
        toggleable: false
    });
    public readonly selectedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly selectedKeys$: Observable<ImmutableSet<any>> = toObservable(this.selectedKeys);
    public readonly selectedNodes: Signal<ImmutableSet<TreeNode<T>>> = computed(() => {
        const selectedKeys = this.selectedKeys();
        const nodeDictionary = this.nodeDictionary();
        return selectedKeys
            .select(k => {
                return nodeDictionary.values().firstOrDefault(n => {
                    const key = this.getSelectKey(n);
                    return key === k;
                });
            })
            .where(n => n != null)
            .cast<TreeNode<T>>()
            .toImmutableSet();
    });
    public readonly selectionChange$: Subject<NodeItem<T>> = new Subject();
    public readonly textField: WritableSignal<string | Selector<T, string>> = signal("");
    public readonly viewNodeSet: Signal<ImmutableSet<TreeNode<T>>> = computed(() => {
        if (this.filterText()) {
            return this.filterTree(this.nodeSet(), this.filterText());
        }
        return this.nodeSet();
    });
    public checkedKeysChange: OutputEmitterRef<any[]> | null = null;
    public expandedKeysChange: OutputEmitterRef<any[]> | null = null;
    public filterChange: OutputEmitterRef<FilterChangeEvent> | null = null;
    public nodeCheck: OutputEmitterRef<NodeCheckEvent<T>> | null = null;
    public nodeClick: OutputEmitterRef<NodeClickEvent<T>> | null = null;
    public nodeDrag: OutputEmitterRef<NodeDragEvent<T>> | null = null;
    public nodeDragEnd: OutputEmitterRef<NodeDragEndEvent<T>> | null = null;
    public nodeDragStart: OutputEmitterRef<NodeDragStartEvent<T>> | null = null;
    public nodeDrop: OutputEmitterRef<NodeDropEvent<T>> | null = null;
    public nodeSelect: OutputEmitterRef<NodeSelectEvent<T>> | null = null;
    public selectionChange: OutputEmitterRef<NodeItem<T>> | null = null;

    public constructor() {
        effect(() => {
            const viewNodes = this.viewNodeSet();
            untracked(() => {
                const flattenedNodes = TreeService.flatten(viewNodes);
                const expandedKeys = flattenedNodes
                    .where(n => !n.children().isEmpty())
                    .select(n => this.getExpandKey(n))
                    .toImmutableSet();
                this.filteredExpandedKeys.set(expandedKeys);
            });
        });
    }

    public static flatten<T>(nodes: Iterable<TreeNode<T>>): List<TreeNode<T>> {
        const flattenedNodes = new List<TreeNode<T>>();
        for (const node of nodes) {
            flattenedNodes.add(node);
            if (!node.children().isEmpty()) {
                flattenedNodes.addAll(TreeService.flatten(node.children()));
            }
        }
        return flattenedNodes;
    }

    public clearFilter(): void {
        this.filter$.next("");
    }

    public getNodeByUid(uid: string): TreeNode<T> | null {
        const nodeDictionary = this.nodeDictionary();
        return nodeDictionary.get(uid) ?? null;
    }

    public getNodeText(node: TreeNode<T>): string {
        const textField = this.textField();
        if (!textField) {
            return String(node.data) || "";
        }
        if (typeof textField === "string") {
            return (node.data as any)[textField];
        }
        return textField(node.data);
    }

    public hasChildren(node: TreeNode<T> | null): boolean {
        if (node === null) {
            return false;
        }
        const hasChildrenPredicate = this.hasChildrenPredicate();
        if (hasChildrenPredicate) {
            return hasChildrenPredicate(node.data);
        }
        return !node.children().isEmpty();
    }

    public isCheckable(node: TreeNode<T>): boolean {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return false;
        }
        return !(checkableOptions.childrenOnly && !node.children().isEmpty());
    }

    public isChecked(node: TreeNode<T>): boolean {
        return node.checked();
    }

    public isDisabled(node: TreeNode<T>): boolean {
        const disableOptions = this.disableOptions();
        const disabledKeys = this.disabledKeys();
        if (!disableOptions.enabled) {
            return false;
        }
        const key = this.getDisableKey(node);
        const disabled = disabledKeys.contains(key);
        if (!disableOptions.disableChildren) {
            return disabled;
        }
        const anyParentDisabled = this.isAnyParentDisabled(node);
        return disabled || (disableOptions.disableChildren && anyParentDisabled);
    }

    public isExpanded(node: TreeNode<T>): boolean {
        const expandableOptions = this.expandableOptions();
        const expandedKeys = this.expandedKeys();
        if (!expandableOptions.enabled) {
            return true;
        }
        if (node.children().isEmpty()) {
            return false;
        }
        const key = this.getExpandKey(node);
        return expandedKeys.contains(key);
    }

    public isIndeterminate(node: TreeNode<T>): boolean {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled || !checkableOptions.checkParents) {
            return false;
        }
        if (node.children().isEmpty()) {
            return false;
        }
        const childNodes = node.children();
        const checkedNodes = childNodes.where(n => this.isChecked(n));
        const indeterminateNodes = childNodes.where(n => this.isIndeterminate(n));
        const checkedCount = checkedNodes.count();
        const indeterminateCount = indeterminateNodes.count();
        const childCount = childNodes.size();
        return (checkedCount > 0 && checkedCount < childCount) || indeterminateCount > 0;
    }

    public isNavigated(node: TreeNode<T>): boolean {
        const navigatedNode = this.navigatedNode();
        return navigatedNode === node;
    }

    public isSelected(node: TreeNode<T>): boolean {
        const selectableOptions = this.selectableOptions();
        const selectedKeys = this.selectedKeys();
        if (!selectableOptions.enabled) {
            return false;
        }
        const key = this.getSelectKey(node);
        return selectedKeys.contains(key);
    }

    public isTreeFiltered(): boolean {
        return this.filterText() !== "";
    }

    public loadNodeChildren(node: TreeNode<T>): void {
        const childrenSelector = this.children();
        if (typeof childrenSelector !== "function") {
            return;
        }
        const children = childrenSelector(node.data);
        if (!(children instanceof Observable)) {
            return;
        }
        node.loading.set(true);
        children.pipe(take(1)).subscribe(c => {
            const childNodes = new List<TreeNode<T>>();
            for (const child of c) {
                const childNode = new TreeNode(child);
                childNode.parent = node;
                childNodes.add(childNode);
            }
            this.loadCheckedKeysForChildren(node, childNodes);
            node.children.update(list => list.clear().addAll(childNodes));
            node.loading.set(false);
            node.loaded.set(true);
        });
    }

    public moveNode(sourceNode: TreeNode<T>, targetNode: TreeNode<T>, position: DropPosition): void {
        switch (position) {
            case "inside":
                this.moveNodeInside(sourceNode, targetNode);
                break;
            case "before":
                this.moveNodeBefore(sourceNode, targetNode);
                break;
            case "after":
                this.moveNodeAfter(sourceNode, targetNode);
                break;
        }
        this.updateNodeIndices();
    }

    public navigate(direction: "next" | "previous"): TreeNode<T> | null {
        const navigableNodes = this.navigableNodes();
        const navigatedNode = this.navigatedNode();
        if (navigableNodes.isEmpty()) {
            return null;
        }
        const firstNode = navigableNodes.first();
        if (navigatedNode === null) {
            this.navigatedNode.set(firstNode);
            return firstNode;
        }
        if (direction === "next") {
            return this.navigateToNextNode();
        }
        if (direction === "previous") {
            return this.navigateToPreviousNode();
        }
        return null;
    }

    public notifySelectionChange(node: TreeNode<T>): void {
        this.selectionChange$.next(node.nodeItem);
    }

    public setAnimationEnabled(enabled: boolean): void {
        this.animationEnabled.set(enabled);
    }

    public setChildrenSelector(selector: string | Selector<T, Iterable<T> | Observable<Iterable<T>>>): void {
        this.children.set(selector);
        this.nodeSet.set(this.createNodes(this.data()));
        this.updateNodeIndices();
    }

    public setCheckBy(selector: string | Selector<T, any> | null): void {
        this.checkBy.set(selector);
    }

    public setCheckableOptions(options: Partial<CheckableOptions>): void {
        this.checkableOptions.update(o => ({ ...o, ...options }));
    }

    public setCheckedKeys(keys: Iterable<any>): void {
        const checkedKeys = this.#checkedKeys().orderBy(k => k);
        const orderedKeys = from(keys).orderBy(k => k);
        if (sequenceEqual(checkedKeys, orderedKeys)) {
            return;
        }
        const checkedKeysSet = this.nodeDictionary()
            .values()
            .where(n => contains(keys, this.getCheckKey(n)))
            .toEnumerableSet();
        this.nodeDictionary().forEach(n => {
            n.value.checked.set(checkedKeysSet.contains(n.value));
        });
    }

    public setData(data: Iterable<T>): void {
        this.data.set(ImmutableSet.create(data));
        this.nodeSet.set(this.createNodes(data));
        this.updateNodeIndices();
    }

    public setDataStructure(structure: DataStructure): void {
        this.structure.set(structure);
    }

    public setDisableBy(selector: string | Selector<T, any> | null): void {
        this.disableBy.set(selector);
    }

    public setDisableOptions(options: Partial<DisableOptions>): void {
        this.disableOptions.update(o => ({ ...o, ...options }));
    }

    public setDisabledKeys(keys: Iterable<any>): void {
        const disabledKeys = this.disabledKeys().orderBy(k => k);
        const orderedKeys = from(keys).orderBy(k => k);
        if (sequenceEqual(disabledKeys, orderedKeys)) {
            return;
        }
        this.disabledKeys.set(ImmutableSet.create(keys));
    }

    public setDraggableOptions(options: Partial<DraggableOptions>): void {
        this.draggableOptions.update(o => ({ ...o, ...options }));
    }

    public setExpandBy(selector: string | Selector<T, any> | null): void {
        this.expandBy.set(selector);
    }

    public setExpandableOptions(options: Partial<ExpandableOptions>): void {
        this.expandableOptions.update(o => ({ ...o, ...options }));
    }

    public setExpandedKeys(keys: Iterable<any>): void {
        const expandedKeys = this.expandedKeys().orderBy(k => k);
        const orderedKeys = from(keys).orderBy(k => k);
        if (sequenceEqual(expandedKeys, orderedKeys)) {
            return;
        }
        this.unfilteredExpandedKeys.set(ImmutableSet.create(keys));
        this.filteredExpandedKeys.set(ImmutableSet.create(keys));
    }

    public setFilterableOptions(options: Partial<FilterableOptions>): void {
        this.filterableOptions.update(o => ({ ...o, ...options }));
    }

    public setFlatIdField(field: string): void {
        this.flatIdField.set(field);
    }

    public setFlatParentIdField(field: string): void {
        this.flatParentIdField.set(field);
    }

    public setHasChildrenPredicate(predicate: Predicate<any>): void {
        this.hasChildrenPredicate.set(predicate);
    }

    public setNodeCheck(node: TreeNode<T>, checked: boolean): void {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return;
        }
        const checkParents = checkableOptions.checkParents;
        const checkChildren = checkableOptions.checkChildren;
        const childrenOnly = checkableOptions.childrenOnly;
        const checkDisabledChildren = checkableOptions.checkDisabledChildren;
        const mode = checkableOptions.mode;
        const key = this.getCheckKey(node);

        const checkedKeys = this.#checkedKeys().toEnumerableSet();
        const nodeDictionary = this.nodeDictionary();

        if (mode === "single") {
            nodeDictionary
                .values()
                .where(n => n !== node)
                .forEach(n => n.checked.set(false));
            checkedKeys.clear();
            checkedKeys.add(key);
        } else if (checked) {
            checkedKeys.add(key);
        } else {
            checkedKeys.remove(key);
        }
        node.checked.set(checked);

        if (checkChildren) {
            const childNodes = this.getChildNodes(node);
            childNodes.forEach(n => {
                if (checkDisabledChildren || !this.isDisabled(n)) {
                    const childKey = this.getCheckKey(n);
                    if (checked) {
                        checkedKeys.add(childKey);
                    } else {
                        checkedKeys.remove(childKey);
                    }
                    n.checked.set(checked);
                }
            });
        }
        if (checkParents && !childrenOnly) {
            const parentNodes = this.getParentNodes(node);
            parentNodes.forEach(n => {
                const childNodes = n.children();
                const allChecked = childNodes.all(c => {
                    return c.checked();
                });
                const parentKey = this.getCheckKey(n);
                if (allChecked) {
                    checkedKeys.add(parentKey);
                } else {
                    checkedKeys.remove(parentKey);
                }
                n.checked.set(allChecked);
            });
        }
        this.#checkedKeys.set(checkedKeys.toImmutableSet());
    }

    public setNodeExpand(node: TreeNode<T>, expanded: boolean): void {
        const key = this.getExpandKey(node);
        const expandedKeysSignal = this.isTreeFiltered() ? this.filteredExpandedKeys : this.unfilteredExpandedKeys;
        expandedKeysSignal.update(keys => {
            if (expanded) {
                return keys.add(key);
            }
            return keys.remove(key);
        });
        this.navigatedNode.set(node);
    }

    public setNodeSelect(node: TreeNode<T>, selected: boolean): void {
        const selectableOptions = this.selectableOptions();
        if (!selectableOptions.enabled) {
            return;
        }
        const childrenOnly = selectableOptions.childrenOnly;
        if (childrenOnly && !node.children().isEmpty()) {
            return;
        }
        const key = this.getSelectKey(node);
        const mode = selectableOptions.mode;
        this.selectedKeys.update(keys => {
            if (mode === "single") {
                const toggleable = selectableOptions.toggleable;
                if (toggleable && keys.contains(key)) {
                    return keys.remove(key);
                } else {
                    return keys.clear().add(key);
                }
            }
            if (selected) {
                return keys.add(key);
            }
            return keys.remove(key);
        });
        this.navigatedNode.set(node);
    }

    public setSelectBy(selector: string | Selector<T, any> | null): void {
        this.selectBy.set(selector);
    }

    public setSelectableOptions(options: Partial<SelectableOptions>): void {
        this.selectableOptions.update(o => ({ ...o, ...options }));
    }

    public setSelectedDataItems(dataItems: Iterable<T>): void {
        const selectBy = this.selectBy();
        if (!selectBy) {
            this.selectedKeys.update(set => set.clear().addAll(dataItems));
        } else {
            const selectedKeys = from(dataItems).select(d => this.getDataItemSelectKey(d));
            this.selectedKeys.update(set => set.clear().addAll(selectedKeys));
        }
    }

    public setSelectedKeys(keys: Iterable<any>): void {
        const selectedKeys = this.selectedKeys().orderBy(k => k);
        const orderedKeys = from(keys).orderBy(k => k);
        if (sequenceEqual(selectedKeys, orderedKeys)) {
            return;
        }
        this.selectedKeys.set(ImmutableSet.create(keys));
    }

    public setTextField(selector: string | Selector<T, string>): void {
        this.textField.set(selector);
    }

    public getCheckKey(node: TreeNode<T>): any {
        const checkBy = this.checkBy();
        if (!checkBy) {
            return node.data;
        }
        if (typeof checkBy === "string") {
            return (node.data as any)[checkBy];
        }
        return checkBy(node.data);
    }

    public getDisableKey(node: TreeNode<T>): any {
        const disableBy = this.disableBy();
        if (!disableBy) {
            return node.data;
        }
        if (typeof disableBy === "string") {
            return (node.data as any)[disableBy];
        }
        return disableBy(node.data);
    }

    public setNodeExpandSubscription(): void {
        this.expandedKeys$.pipe(pairwise(), takeUntilDestroyed(this.#destroyRef)).subscribe(([oldKeys, keys]) => {
            const orderedOldKeys = oldKeys.orderBy(k => k);
            const orderedKeys = keys.orderBy(k => k);
            if (sequenceEqual(orderedOldKeys, orderedKeys)) {
                return;
            }
            if (this.expandedKeysChange) {
                this.expandedKeysChange.emit(keys.toArray());
            }
        });
    }

    private createFlatNodes(data: Iterable<T>, parentId: string | null): ImmutableSet<TreeNode<T>> {
        const flatIdField = this.flatIdField();
        const flatParentIdField = this.flatParentIdField();
        const nodes = new List<TreeNode<T>>();
        for (const item of data) {
            const dataItem = item as any;
            if (dataItem[flatParentIdField] === parentId) {
                const node = new TreeNode(item);
                node.children.set(this.createFlatNodes(data, dataItem[flatIdField]));
                node.children().forEach(n => (n.parent = node));
                nodes.add(node);
            }
        }
        return nodes.toImmutableSet();
    }

    private createHierarchicalNodes(
        root: Iterable<T>,
        parent: TreeNode<T> | null,
        nodeDict: ImmutableDictionary<string, TreeNode<T>>
    ): ImmutableSet<TreeNode<T>> | null {
        const rootList = new List(root);
        const children = this.children();
        if (rootList.isEmpty() || !children) {
            return null;
        }
        const nodes = new EnumerableSet<TreeNode<T>>();
        for (const dataItem of rootList) {
            const existingNode = nodeDict.firstOrDefault(n => n.value.data === dataItem);
            let node: TreeNode<T>;
            if (existingNode) {
                node = existingNode.value;
            } else {
                node = new TreeNode(dataItem);
                node.parent = parent;
            }

            if (typeof children === "string") {
                const subNodes = (dataItem as any)[children];
                if (subNodes) {
                    const childNodes = this.createHierarchicalNodes(subNodes, node, nodeDict);
                    node.loaded.set(true);
                    node.children.update(list => list.clear().addAll(childNodes ?? []));
                    if (node.parent) {
                        node.parent.children.update(list => list.add(node));
                    }
                }
            } else {
                const result = children(dataItem);
                if (!(result instanceof Observable)) {
                    const childNodes = this.createHierarchicalNodes(result, node, nodeDict);
                    node.loaded.set(true);
                    node.children.update(list => list.clear().addAll(childNodes ?? []));
                    if (node.parent) {
                        node.parent.children.update(list => list.add(node));
                    }
                } else if (result instanceof Observable && node.loaded()) {
                    result.pipe(take(1)).subscribe(c => {
                        const childNodes = this.createHierarchicalNodes(c, node, nodeDict);
                        node.children.update(list => list.clear().addAll(childNodes ?? []));
                    });
                }
            }
            nodes.add(node);
        }
        return nodes.toImmutableSet();
    }

    private createNodeDictionary(nodes: Iterable<TreeNode<T>>): ImmutableDictionary<string, TreeNode<T>> {
        return TreeService.flatten(nodes).toImmutableDictionary(
            n => n.uid,
            n => n
        );
    }

    private createNodes(data: Iterable<T>): ImmutableSet<TreeNode<T>> {
        const structure = this.structure();
        if (structure === "flat") {
            return this.createFlatNodes(data, null).toImmutableSet();
        }
        const nodeDictionary = this.nodeDictionary();
        return this.createHierarchicalNodes(data, null, nodeDictionary) ?? ImmutableSet.create();
    }

    private filterTree(nodes: Iterable<TreeNode<T>>, filterText: string): ImmutableSet<TreeNode<T>> {
        const nodeList = untracked(() => {
            return aggregate(
                nodes,
                (result, node) => {
                    const nodeText = this.getNodeText(node);
                    if (this.isFiltered(nodeText, filterText)) {
                        result.add(node);
                    } else if (!node.children().isEmpty()) {
                        const newNodes = this.filterTree(node.children(), filterText);
                        if (!newNodes.isEmpty()) {
                            const clonedNode = node.clone();
                            clonedNode.children.update(list => list.clear().addAll(newNodes));
                            result.add(clonedNode);
                        }
                    }
                    return result;
                },
                new List<TreeNode<T>>()
            );
        });
        return nodeList.toImmutableSet();
    }

    private getExpandKey(node: TreeNode<T>): any {
        const expandBy = this.expandBy();
        if (!expandBy) {
            return node.data;
        }
        if (typeof expandBy === "string") {
            return (node.data as any)[expandBy];
        }
        return expandBy(node.data);
    }

    private getChildNodes(node: TreeNode<T>): ImmutableSet<TreeNode<T>> {
        const nodes = TreeService.flatten([node]);
        return nodes.where(n => n !== node).toImmutableSet();
    }

    private getDataItemSelectKey(dataItem: T): any | null {
        const selectBy = this.selectBy();
        if (!selectBy) {
            return dataItem;
        }
        if (typeof selectBy === "string") {
            return (dataItem as any)[selectBy] ?? dataItem;
        }
        return selectBy(dataItem);
    }

    private getParentNodes(node: TreeNode<T>): ImmutableSet<TreeNode<T>> {
        const nodes = new List<TreeNode<T>>();
        let current = node.parent;
        while (current !== null) {
            nodes.add(current);
            current = current.parent;
        }
        return nodes.toImmutableSet();
    }

    private getSelectKey(node: TreeNode<T>): any {
        const selectBy = this.selectBy();
        if (!selectBy) {
            return node.data;
        }
        if (typeof selectBy === "string") {
            return (node.data as any)[selectBy];
        }
        return selectBy(node.data);
    }

    private isAnyParentCollapsed(node: TreeNode<T>): boolean {
        if (node.parent) {
            return !this.isExpanded(node.parent) || this.isAnyParentCollapsed(node.parent);
        }
        return false;
    }

    private isAnyParentDisabled(node: TreeNode<T>): boolean {
        if (node.parent) {
            return this.isDisabled(node.parent) || this.isAnyParentDisabled(node.parent);
        }
        return false;
    }

    private isFiltered(nodeText: string, filterText: string): boolean {
        const text = this.filterableOptions().caseSensitive ? nodeText : nodeText.toLowerCase();
        const filter = this.filterableOptions().caseSensitive ? filterText : filterText.toLowerCase();
        const operator = this.filterableOptions().operator;
        if (typeof operator === "function") {
            return operator(text, filter);
        }
        if (operator === "contains") {
            return text.indexOf(filter) >= 0;
        }
        if (operator === "endsWith") {
            return text.endsWith(filter);
        }
        if (operator === "startsWith") {
            return text.startsWith(filter);
        }
        return text.indexOf(filter) >= 0;
    }

    private loadCheckedKeysForChildren(node: TreeNode<T>, childNodes: Iterable<TreeNode<T>>): void {
        if (node.checked() && this.checkableOptions().checkChildren) {
            const checkedKeys = this.#checkedKeys();
            const checkDisabledChildren = this.checkableOptions().checkDisabledChildren;
            const childKeys = new EnumerableSet();
            forEach(childNodes, n => {
                if (checkDisabledChildren || !this.isDisabled(n)) {
                    const childKey = this.getCheckKey(n);
                    childKeys.add(childKey);
                    n.checked.set(true);
                }
            });
            this.#checkedKeys.set(checkedKeys.addAll(childKeys));
        }
    }

    private moveNodeAfter(sourceNode: TreeNode<T>, targetNode: TreeNode<T>): void {
        if (sourceNode.parent) {
            sourceNode.parent.children.update(list => {
                const sourceNodeParent = sourceNode.parent as TreeNode<T>;
                return list.clear().addAll(sourceNodeParent.children().where(n => n !== sourceNode));
            });
        }
        if (targetNode.parent) {
            const index = targetNode.parent.children().toImmutableList().indexOf(targetNode);
            if (index === -1) {
                return;
            }
            targetNode.parent.children.update(set => {
                const tempList = set.toList();
                tempList.addAt(sourceNode, index + 1);
                return tempList.toImmutableSet();
            });

            if (!sourceNode.parent) {
                this.nodeSet.update(nodes => nodes.remove(sourceNode));
            }
            sourceNode.parent = targetNode.parent;
        } else {
            const index = this.nodeSet().toList().indexOf(targetNode);
            if (index === -1) {
                return;
            }
            this.nodeSet.update(nodes => {
                const newNodes = nodes.where(n => n !== sourceNode).toList();
                newNodes.addAt(sourceNode, index + 1);
                return newNodes.toImmutableSet();
            });
            if (!sourceNode.parent) {
                this.nodeSet.update(nodes => nodes.remove(sourceNode));
            }
            sourceNode.parent = null;
        }
    }

    private moveNodeBefore(sourceNode: TreeNode<T>, targetNode: TreeNode<T>): void {
        if (sourceNode.parent) {
            sourceNode.parent.children.update(list => {
                const sourceNodeParent = sourceNode.parent as TreeNode<T>;
                return list.clear().addAll(sourceNodeParent.children().where(n => n !== sourceNode));
            });
        }
        if (targetNode.parent) {
            const index = targetNode.parent.children().toImmutableList().indexOf(targetNode);
            if (index === -1) {
                return;
            }
            targetNode.parent.children.update(set => {
                const tempList = set.toList();
                tempList.addAt(sourceNode, index);
                return tempList.toImmutableSet();
            });
            if (!sourceNode.parent) {
                this.nodeSet.update(nodes => nodes.remove(sourceNode));
            }
            sourceNode.parent = targetNode.parent;
        } else {
            const index = this.nodeSet().toList().indexOf(targetNode);
            if (index === -1) {
                return;
            }
            this.nodeSet.update(nodes => {
                const newNodes = nodes.where(n => n !== sourceNode).toList();
                newNodes.addAt(sourceNode, index);
                return newNodes.toImmutableSet();
            });
            if (!sourceNode.parent) {
                this.nodeSet.update(nodes => nodes.remove(sourceNode));
            }
            sourceNode.parent = null;
        }
    }

    private moveNodeInside(sourceNode: TreeNode<T>, targetNode: TreeNode<T>): void {
        if (sourceNode.parent === targetNode || this.isDisabled(targetNode)) {
            return;
        }
        if (sourceNode.parent) {
            sourceNode.parent.children.update(list => {
                const sourceNodeParent = sourceNode.parent as TreeNode<T>;
                return list.clear().addAll(sourceNodeParent.children().where(n => n !== sourceNode));
            });
        } else {
            this.nodeSet.update(nodes => nodes.remove(sourceNode));
        }
        targetNode.children.update(list => list.add(sourceNode));
        sourceNode.parent = targetNode;
        this.nodeSet.update(n => n.toImmutableSet());
    }

    private navigateToNextNode(): TreeNode<T> {
        const navigableNodes = this.navigableNodes();
        const navigatedNode = this.navigatedNode();
        const firstNode = navigableNodes.first();
        let nextNode: TreeNode<T> | null = navigableNodes
            .skipWhile(n => n !== navigatedNode)
            .skip(1)
            .firstOrDefault();
        if (nextNode === null) {
            this.navigatedNode.set(firstNode);
            return firstNode;
        } else {
            this.navigatedNode.set(nextNode);
            return nextNode;
        }
    }

    private navigateToPreviousNode(): TreeNode<T> {
        const navigableNodes = this.navigableNodes();
        const navigatedNode = this.navigatedNode();
        let previousNode: TreeNode<T> | null = navigableNodes.takeWhile(n => n !== navigatedNode).lastOrDefault();
        if (previousNode === null) {
            this.navigatedNode.set(navigableNodes.last());
            return navigableNodes.last();
        } else {
            this.navigatedNode.set(previousNode);
            return previousNode;
        }
    }

    private updateNodeIndices(): void {
        const updateRecursively = (nodes: Iterable<TreeNode<T>>, parent: TreeNode<T> | null): void => {
            let index = 0;
            for (const node of nodes) {
                node.index = parent == null ? String(index++) : `${parent.index}.${index++}`;
                updateRecursively(node.children(), node);
            }
        };
        updateRecursively(this.nodeSet(), null);
    }
}
