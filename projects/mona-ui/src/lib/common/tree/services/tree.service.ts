import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import {
    Dictionary,
    empty,
    forEach,
    IEnumerable,
    ImmutableDictionary,
    ImmutableSet,
    List,
    selectMany,
    Selector
} from "@mirei/ts-collections";
import { Observable, Subject, take } from "rxjs";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { NodeClickEvent } from "../models/NodeClickEvent";
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
    public readonly children: WritableSignal<string | Selector<T, Iterable<T>> | Observable<Iterable<T>>> = signal("");
    public readonly expandBy: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly expandableOptions: WritableSignal<ExpandableOptions> = signal({ enabled: false });
    public readonly expandedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly nodeClick$: Subject<NodeClickEvent<T>> = new Subject();
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
    public constructor() {}

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

    public setExpandBy(selector: string | Selector<T, any> | null): void {
        this.expandBy.set(selector);
    }

    public setExpandableOptions(options: Partial<ExpandableOptions>): void {
        this.expandableOptions.update(o => ({ ...o, ...options }));
    }

    public setExpandedKeys(keys: Iterable<any>): void {
        this.expandedKeys.set(ImmutableSet.create(keys));
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
        const flatten = (subNodes: Iterable<TreeNode<T>>): List<TreeNode<T>> => {
            const flattenedNodes = new List<TreeNode<T>>();
            for (const node of subNodes) {
                flattenedNodes.add(node);
                if (!node.children.isEmpty()) {
                    flattenedNodes.addAll(flatten(node.children));
                }
            }
            return flattenedNodes;
        };
        return flatten(nodes).toDictionary(
            n => n.uid,
            n => n
        );
    }

    private createNodes(data: Iterable<T>): ImmutableSet<TreeNode<T>> {
        const nodes: List<TreeNode<any>> = new List();
        this.createNodesRecursively(data, nodes, null);
        console.log("Nodes: ", nodes.toArray());
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
