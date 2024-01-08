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
import { Observable, take } from "rxjs";
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
    public readonly children: WritableSignal<string | Selector<T, Iterable<T>> | Observable<Iterable<T>>> = signal("");
    public readonly nodeSet: Signal<ImmutableSet<TreeNode<T>>> = computed(() => {
        const data = this.data();
        return this.createNodes(data);
    });
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

    public setChildrenSelector(selector: string | Selector<T, Iterable<T>> | Observable<Iterable<T>>): void {
        this.children.set(selector);
    }

    public setData(data: Iterable<T>): void {
        this.data.set(ImmutableSet.create(data));
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
}
