import { computed, EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Dictionary, from, ImmutableDictionary, ImmutableSet, List, Selector } from "@mirei/ts-collections";
import { Observable, Subject, take } from "rxjs";
import { CheckableOptions } from "../models/CheckableOptions";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { NodeCheckEvent } from "../models/NodeCheckEvent";
import { NodeClickEvent } from "../models/NodeClickEvent";
import { NodeExpandEvent } from "../models/NodeExpandEvent";
import { SelectableOptions } from "../models/SelectableOptions";
import { TreeNode } from "../models/TreeNode";

@Injectable()
export class TreeService<T> {
    private readonly data: WritableSignal<ImmutableSet<T>> = signal(ImmutableSet.create());
    private readonly nodeDictionary: Signal<ImmutableDictionary<string, TreeNode<T>>> = computed(() => {
        const data = this.data();
        const nodes = this.createNodes(data);
        const nodeDict = this.createNodeDictionary(nodes);
        return nodeDict.toImmutableDictionary(
            p => p.key,
            p => p.value
        );
    });
    public readonly animationEnabled: WritableSignal<boolean> = signal(true);
    public readonly checkBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly checkableOptions: WritableSignal<CheckableOptions> = signal({
        checkChildren: true,
        checkParents: true,
        enabled: false,
        mode: "multiple"
    });
    public readonly checkedKeys: WritableSignal<ImmutableDictionary<any, boolean>> = signal(
        ImmutableDictionary.create()
    );
    public readonly children: WritableSignal<string | Selector<T, Iterable<T>> | Observable<Iterable<T>>> = signal("");
    public readonly expandBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly expandableOptions: WritableSignal<ExpandableOptions> = signal({ enabled: false });
    public readonly expandedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly nodeCheck$: Subject<NodeCheckEvent<T>> = new Subject();
    public readonly nodeClick$: Subject<NodeClickEvent<T>> = new Subject();
    public readonly nodeExpand$: Subject<NodeExpandEvent<T>> = new Subject();
    public readonly nodeSelect$: Subject<TreeNode<T>> = new Subject();
    public readonly nodeSet: Signal<ImmutableSet<TreeNode<T>>> = computed(() => {
        const data = this.data();
        return this.createNodes(data);
    });
    public readonly selectBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly selectableOptions: WritableSignal<SelectableOptions> = signal({
        childrenOnly: false,
        enabled: false,
        mode: "single"
    });
    public readonly selectedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
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

    public isChecked(node: TreeNode<T>): boolean {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return false;
        }
        const key = this.getCheckKey(node);
        return this.checkedKeys().containsKey(key);
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
        if (this.isChecked(node)) {
            return false;
        }
        const childNodes = this.getChildNodes(node);
        const checkedNodes = childNodes.where(n => this.isChecked(n));
        const checkedCount = checkedNodes.count();
        const childCount = childNodes.size();
        return checkedCount > 0 && checkedCount < childCount;
    }

    public isSelected(node: TreeNode<T>): boolean {
        const selectableOptions = this.selectableOptions();
        if (!selectableOptions.enabled) {
            return false;
        }
        const key = this.getSelectKey(node);
        return this.selectedKeys().contains(key);
    }

    public setAnimationEnabled(enabled: boolean): void {
        this.animationEnabled.set(enabled);
    }

    public setChildrenSelector(selector: string | Selector<T, Iterable<T>> | Observable<Iterable<T>>): void {
        this.children.set(selector);
    }

    public setData(data: Iterable<T>): void {
        this.data.set(ImmutableSet.create(data));
    }

    public setCheckBy(selector: string | Selector<T, any> | null): void {
        this.checkBy.set(selector);
    }

    public setCheckableOptions(options: Partial<CheckableOptions>): void {
        this.checkableOptions.update(o => ({ ...o, ...options }));
    }

    public setCheckedKeys(keys: Iterable<any>): void {
        this.checkedKeys.set(
            ImmutableDictionary.create(
                from(keys).toDictionary(
                    k => k,
                    k => true
                )
            )
        );
    }

    public setExpandBy(selector: string | Selector<T, any> | null): void {
        this.expandBy.set(selector);
    }

    public setExpandableOptions(options: Partial<ExpandableOptions>): void {
        this.expandableOptions.update(o => ({ ...o, ...options }));
    }

    public setExpandedKeys(keys: Iterable<any>): void {
        this.expandedKeys.set(ImmutableSet.create(keys));
    }

    public setNodeCheck(node: TreeNode<T>, checked: boolean): void {
        const checkableOptions = this.checkableOptions();
        if (!checkableOptions.enabled) {
            return;
        }
        const checkParents = checkableOptions.checkParents;
        const checkChildren = checkableOptions.checkChildren;
        const mode = checkableOptions.mode;
        const key = this.getCheckKey(node);

        const checkedKeys = this.checkedKeys().toDictionary(
            p => p.key,
            p => p.value
        );

        if (mode === "single") {
            checkedKeys.clear();
            checkedKeys.put(key, true);
        } else if (checked) {
            checkedKeys.put(key, true);
        } else {
            checkedKeys.remove(key);
        }

        if (checkChildren) {
            const childNodes = this.getChildNodes(node);
            childNodes.forEach(n => {
                const childKey = this.getCheckKey(n);
                if (checked) {
                    checkedKeys.put(childKey, true);
                } else {
                    checkedKeys.remove(childKey);
                }
            });
        }
        if (checkParents) {
            const parentNodes = this.getParentNodes(node);
            parentNodes.forEach(n => {
                const childNodes = this.getChildNodes(n);
                const allChecked = childNodes.all(c => {
                    const childKey = this.getCheckKey(c);
                    return checkedKeys.containsKey(childKey);
                });
                const parentKey = this.getCheckKey(n);
                if (allChecked) {
                    checkedKeys.put(parentKey, true);
                } else {
                    checkedKeys.remove(parentKey);
                }
            });
        }
        this.checkedKeys.set(
            checkedKeys.toImmutableDictionary(
                p => p.key,
                p => p.value
            )
        );
    }

    public setNodeExpand(node: TreeNode<T>, expanded: boolean): void {
        const key = this.getExpandKey(node);
        this.expandedKeys.update(keys => {
            if (expanded) {
                return keys.add(key);
            }
            return keys.remove(key);
        });
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
                return keys.clear().add(key);
            }
            if (selected) {
                return keys.add(key);
            }
            return keys.remove(key);
        });
    }

    public setSelectBy(selector: string | Selector<T, any> | null): void {
        this.selectBy.set(selector);
    }

    public setSelectableOptions(options: Partial<SelectableOptions>): void {
        this.selectableOptions.update(o => ({ ...o, ...options }));
    }

    public setSelectedKeys(keys: Iterable<any>): void {
        this.selectedKeys.set(ImmutableSet.create(keys));
    }

    public setTextField(selector: string | Selector<T, string>): void {
        this.textField.set(selector);
    }

    private createNodeDictionary(nodes: Iterable<TreeNode<T>>): Dictionary<string, TreeNode<T>> {
        return TreeService.flatten(nodes).toDictionary(
            n => n.uid,
            n => n
        );
    }

    private createNodes(data: Iterable<T>): ImmutableSet<TreeNode<T>> {
        const nodes: List<TreeNode<any>> = new List();
        this.createNodesRecursively(data, nodes, null);
        console.log("Nodes: ", nodes.toArray());
        console.log("Flattened nodes: ", TreeService.flatten(nodes).toArray());
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
            return node.uid;
        }
        if (typeof checkBy === "string") {
            return (node.data as any)[checkBy];
        }
        return checkBy(node.data);
    }

    private getExpandKey(node: TreeNode<T>): any {
        const expandBy = this.expandBy();
        if (!expandBy) {
            return node.uid;
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
            return node.uid;
        }
        if (typeof selectBy === "string") {
            return (node.data as any)[selectBy];
        }
        return selectBy(node.data);
    }
}
