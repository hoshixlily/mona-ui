import { computed, EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { from, ImmutableDictionary, ImmutableSet, List, Selector, sequenceEqual } from "@mirei/ts-collections";
import { BehaviorSubject, Observable, ReplaySubject, Subject, take } from "rxjs";
import { CheckableOptions } from "../models/CheckableOptions";
import { DisableOptions } from "../models/DisableOptions";
import { DraggableOptions } from "../models/DraggableOptions";
import { DropPosition, DropPositionChangeEvent } from "../models/DropPositionChangeEvent";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { NodeCheckEvent } from "../models/NodeCheckEvent";
import { NodeClickEvent } from "../models/NodeClickEvent";
import { NodeDragEndEvent } from "../models/NodeDragEndEvent";
import { NodeDragEvent } from "../models/NodeDragEvent";
import { NodeDragStartEvent } from "../models/NodeDragStartEvent";
import { NodeDropEvent } from "../models/NodeDropEvent";
import { NodeSelectEvent } from "../models/NodeSelectEvent";
import { SelectableOptions } from "../models/SelectableOptions";
import { TreeNode } from "../models/TreeNode";
import { TreeNodeCheckEvent } from "../models/TreeNodeCheckEvent";
import { TreeNodeExpandEvent } from "../models/TreeNodeExpandEvent";
import { TreeNodeSelectEvent } from "../models/TreeNodeSelectEvent";

@Injectable()
export class TreeService<T> {
    private readonly data: WritableSignal<ImmutableSet<T>> = signal(ImmutableSet.create());
    private readonly navigableNodes: Signal<ImmutableSet<TreeNode<T>>> = computed(() => {
        return this.nodeDictionary()
            .where(n => n.value.parent === null || !this.isAnyParentCollapsed(n.value))
            .select(n => n.value)
            .orderBy(n => n.index)
            .toImmutableSet();
    });
    private readonly nodeDictionary: Signal<ImmutableDictionary<string, TreeNode<T>>> = computed(() => {
        const nodes = this.nodeSet();
        return this.createNodeDictionary(nodes);
    });
    public readonly animationEnabled: WritableSignal<boolean> = signal(true);
    public readonly checkBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly checkableOptions: WritableSignal<CheckableOptions> = signal({
        checkChildren: true,
        checkParents: true,
        childrenOnly: false,
        enabled: false,
        mode: "multiple"
    });
    public readonly checkedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly checkedKeys$: Observable<ImmutableSet<any>> = toObservable(this.checkedKeys);
    public readonly children: WritableSignal<string | Selector<T, Iterable<T>> | Observable<Iterable<T>>> = signal("");
    public readonly disableBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly disableOptions: WritableSignal<DisableOptions> = signal({
        disableChildren: true,
        enabled: false
    });
    public readonly disabledKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly draggableOptions: WritableSignal<DraggableOptions> = signal({ enabled: true });
    public readonly dragging: WritableSignal<boolean> = signal(false);
    public readonly dragging$: Observable<boolean> = toObservable(this.dragging);
    public readonly dropPositionChange$: BehaviorSubject<DropPositionChangeEvent<T> | null> =
        new BehaviorSubject<DropPositionChangeEvent<T> | null>(null);
    public readonly expandBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly expandableOptions: WritableSignal<ExpandableOptions> = signal({ enabled: false });
    public readonly expandedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly expandedKeys$: Observable<ImmutableSet<any>> = toObservable(this.expandedKeys);
    public readonly navigatedNode: WritableSignal<TreeNode<T> | null> = signal(null);
    public readonly nodeCheck$: Subject<NodeCheckEvent<T>> = new Subject();
    public readonly nodeCheckChange$: Subject<TreeNodeCheckEvent<T>> = new Subject();
    public readonly nodeClick$: Subject<NodeClickEvent<T>> = new Subject();
    public readonly nodeDrag$: Subject<NodeDragEvent<T>> = new Subject();
    public readonly nodeDragEnd$: Subject<NodeDragEndEvent<T>> = new Subject();
    public readonly nodeDragStart$: Subject<NodeDragStartEvent<T>> = new Subject();
    public readonly nodeDrop$: Subject<NodeDropEvent<T>> = new Subject();
    public readonly nodeExpand$: Subject<TreeNodeExpandEvent<T>> = new Subject();
    public readonly nodeSelect$: Subject<NodeSelectEvent<T>> = new Subject();
    public readonly nodeSelectChange$: Subject<TreeNodeSelectEvent<T>> = new Subject();
    public readonly nodeSet: WritableSignal<ImmutableSet<TreeNode<T>>> = signal(ImmutableSet.create());
    public readonly selectBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly selectableOptions: WritableSignal<SelectableOptions> = signal({
        childrenOnly: false,
        enabled: false,
        mode: "single",
        toggleable: false
    });
    public readonly selectedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly selectedKeys$: Observable<ImmutableSet<any>> = toObservable(this.selectedKeys);
    public readonly textField: WritableSignal<string | Selector<T, string>> = signal("");
    public checkedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
    public expandedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
    public selectedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    public constructor() {}

    public static flatten<T>(nodes: Iterable<TreeNode<T>>): List<TreeNode<T>> {
        const flattenedNodes = new List<TreeNode<T>>();
        for (const node of nodes) {
            flattenedNodes.add(node);
            if (!node.children.isEmpty()) {
                flattenedNodes.addAll(TreeService.flatten(node.children));
            }
        }
        return flattenedNodes;
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

    public isCheckable(node: TreeNode<T>): boolean {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return false;
        }
        return !(checkableOptions.childrenOnly && !node.children.isEmpty());
    }

    public isChecked(node: TreeNode<T>): boolean {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return false;
        }
        const key = this.getCheckKey(node);
        return this.checkedKeys().contains(key);
    }

    public isDisabled(node: TreeNode<T>): boolean {
        const disableOptions = this.disableOptions();
        if (!disableOptions.enabled) {
            return false;
        }
        const key = this.getDisableKey(node);
        const disabled = this.disabledKeys().contains(key);
        if (!disableOptions.disableChildren) {
            return disabled;
        }
        const anyParentDisabled = this.isAnyParentDisabled(node);
        return disabled || (disableOptions.disableChildren && anyParentDisabled);
    }

    public isExpanded(node: TreeNode<T>): boolean {
        const expandableOptions = this.expandableOptions();
        if (!expandableOptions.enabled) {
            return true;
        }
        if (node.children.isEmpty()) {
            return false;
        }
        const key = this.getExpandKey(node);
        return this.expandedKeys().contains(key);
    }

    public isIndeterminate(node: TreeNode<T>): boolean {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled || !checkableOptions.checkParents) {
            return false;
        }
        if (node.children.isEmpty()) {
            return false;
        }
        const childNodes = this.getChildNodes(node);
        const checkedNodes = childNodes.where(n => this.isChecked(n));
        const checkedCount = checkedNodes.count();
        const childCount = childNodes.size();
        return checkedCount > 0 && checkedCount < childCount;
    }

    public isNavigated(node: TreeNode<T>): boolean {
        const navigatedNode = this.navigatedNode();
        return navigatedNode === node;
    }

    public isSelected(node: TreeNode<T>): boolean {
        const selectableOptions = this.selectableOptions();
        if (!selectableOptions.enabled) {
            return false;
        }
        const key = this.getSelectKey(node);
        return this.selectedKeys().contains(key);
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

    public setAnimationEnabled(enabled: boolean): void {
        this.animationEnabled.set(enabled);
    }

    public setChildrenSelector(selector: string | Selector<T, Iterable<T>> | Observable<Iterable<T>>): void {
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
        const checkedKeys = this.checkedKeys().orderBy(k => k);
        const orderedKeys = from(keys).orderBy(k => k);
        if (sequenceEqual(checkedKeys, orderedKeys)) {
            return;
        }
        this.checkedKeys.set(ImmutableSet.create(keys));
    }

    public setData(data: Iterable<T>): void {
        this.data.set(ImmutableSet.create(data));
        this.nodeSet.set(this.createNodes(data));
        this.updateNodeIndices();
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
        this.expandedKeys.set(ImmutableSet.create(keys));
    }

    public setNodeCheck(node: TreeNode<T>, checked: boolean): void {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return;
        }
        const checkParents = checkableOptions.checkParents;
        const checkChildren = checkableOptions.checkChildren;
        const childrenOnly = checkableOptions.childrenOnly;
        const mode = checkableOptions.mode;
        const key = this.getCheckKey(node);

        const checkedKeys = this.checkedKeys().toEnumerableSet();

        if (mode === "single") {
            checkedKeys.clear();
            checkedKeys.add(key);
        } else if (checked) {
            checkedKeys.add(key);
        } else {
            checkedKeys.remove(key);
        }

        if (checkChildren) {
            const childNodes = this.getChildNodes(node);
            childNodes.forEach(n => {
                const childKey = this.getCheckKey(n);
                if (checked) {
                    checkedKeys.add(childKey);
                } else {
                    checkedKeys.remove(childKey);
                }
            });
        }
        if (checkParents && !childrenOnly) {
            const parentNodes = this.getParentNodes(node);
            parentNodes.forEach(n => {
                const childNodes = this.getChildNodes(n);
                const allChecked = childNodes.all(c => {
                    const childKey = this.getCheckKey(c);
                    return checkedKeys.contains(childKey);
                });
                const parentKey = this.getCheckKey(n);
                if (allChecked) {
                    checkedKeys.add(parentKey);
                } else {
                    checkedKeys.remove(parentKey);
                }
            });
        }
        this.checkedKeys.set(checkedKeys.toImmutableSet());
    }

    public setNodeExpand(node: TreeNode<T>, expanded: boolean): void {
        const key = this.getExpandKey(node);
        this.expandedKeys.update(keys => {
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
        if (childrenOnly && !node.children.isEmpty()) {
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

    private createNodeDictionary(nodes: Iterable<TreeNode<T>>): ImmutableDictionary<string, TreeNode<T>> {
        return TreeService.flatten(nodes).toImmutableDictionary(
            n => n.uid,
            n => n
        );
    }

    private createNodes(data: Iterable<T>): ImmutableSet<TreeNode<T>> {
        const nodes: List<TreeNode<any>> = new List();
        this.createNodesRecursively(data, nodes, null);
        return ImmutableSet.create(nodes);
    }

    private createNodesRecursively(root: Iterable<T>, childNodes: List<TreeNode<T>>, parent: TreeNode<T> | null): void {
        const rootList = new List(root);
        if (rootList.isEmpty()) {
            return;
        }
        for (const dataItem of rootList) {
            const node = new TreeNode(dataItem);
            node.parent = parent;

            const children = this.children();
            if (typeof children === "string") {
                const subNodes = (dataItem as any)[children];
                if (subNodes) {
                    this.createNodesRecursively(subNodes, node.children, node);
                }
            } else if (children instanceof Observable) {
                children.pipe(take(1)).subscribe(childrenData => {
                    if (childrenData) {
                        this.createNodesRecursively(childrenData, node.children, node);
                    }
                });
            } else {
                const subNodes = children(dataItem);
                if (subNodes) {
                    this.createNodesRecursively(subNodes, node.children, node);
                }
            }
            childNodes.add(node);
        }
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

    private moveNodeAfter(sourceNode: TreeNode<T>, targetNode: TreeNode<T>): void {
        if (sourceNode.parent) {
            sourceNode.parent.children = sourceNode.parent.children.where(n => n !== sourceNode).toList();
        }
        if (targetNode.parent) {
            const index = targetNode.parent.children.indexOf(targetNode);
            if (index === -1) {
                return;
            }
            targetNode.parent.children.addAt(sourceNode, index + 1);
            targetNode.parent.children = targetNode.parent.children.toList();
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
            sourceNode.parent.children = sourceNode.parent.children.where(n => n !== sourceNode).toList();
        }
        if (targetNode.parent) {
            const index = targetNode.parent.children.indexOf(targetNode);
            if (index === -1) {
                return;
            }
            targetNode.parent.children.addAt(sourceNode, index);
            targetNode.parent.children = targetNode.parent.children.toList();
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
            sourceNode.parent.children = sourceNode.parent.children.where(n => n !== sourceNode).toList();
        } else {
            this.nodeSet.update(nodes => nodes.remove(sourceNode));
        }
        targetNode.children = targetNode.children.append(sourceNode).toList();
        sourceNode.parent = targetNode;
        this.setNodeExpand(targetNode, true);
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
        const updateRecursively = (nodes: Iterable<TreeNode<T>>, parent: TreeNode<T> | null) => {
            let index = 0;
            for (const node of nodes) {
                node.index = parent == null ? String(index++) : `${parent.index}.${index++}`;
                updateRecursively(node.children, node);
            }
        };
        updateRecursively(this.nodeSet(), null);
    }
}
