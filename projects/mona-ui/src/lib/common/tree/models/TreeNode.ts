import { signal } from "@angular/core";
import { ImmutableSet } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { NodeItem } from "./NodeItem";

export class TreeNode<T> {
    public readonly checked = signal(false);
    public readonly children = signal(ImmutableSet.create<TreeNode<T>>());
    public readonly data: T;
    public readonly loaded = signal(false);
    public readonly loading = signal(false);
    public readonly uid: string = v4();
    public index: string = "";
    public parent: TreeNode<T> | null = null;

    public constructor(data: T) {
        this.data = data;
    }

    public clone(): TreeNode<T> {
        const node = new TreeNode<T>(this.data);
        node.index = this.index;
        node.children.set(ImmutableSet.create(this.children().select(c => c.clone())));
        node.parent = this.parent;
        return node;
    }

    public isDescendantOf(node: TreeNode<T>): boolean {
        let parent = this.parent;
        while (parent != null) {
            if (parent === node) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }

    public get nodeItem(): NodeItem<T> {
        return {
            data: this.data,
            hasChildren: this.children().length > 0
        };
    }
}
