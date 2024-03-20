import { signal, WritableSignal } from "@angular/core";
import { ImmutableList } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { NodeItem } from "./NodeItem";

export class TreeNode<T> {
    public readonly data: T;
    public readonly uid: string = v4();
    public children: WritableSignal<ImmutableList<TreeNode<T>>> = signal(ImmutableList.create());
    public index: string = "";
    public loaded: WritableSignal<boolean> = signal(false);
    public loading: WritableSignal<boolean> = signal(false);
    public parent: TreeNode<T> | null = null;

    public constructor(data: T) {
        this.data = data;
    }

    public clone(): TreeNode<T> {
        const node = new TreeNode<T>(this.data);
        node.index = this.index;
        node.children.set(ImmutableList.create(this.children().select(c => c.clone())));
        node.parent = this.parent;
        return node;
    }

    public get nodeItem(): NodeItem<T> {
        return {
            data: this.data,
            hasChildren: this.children().length > 0
        };
    }
}
