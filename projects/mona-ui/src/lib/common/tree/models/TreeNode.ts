import { List } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { NodeItem } from "./NodeItem";

export class TreeNode<T> {
    public readonly data: T;
    public readonly uid: string = v4();
    public children: List<TreeNode<T>> = new List();
    public index: string = "";
    public parent: TreeNode<T> | null = null;

    public constructor(data: T) {
        this.data = data;
    }

    public get nodeItem(): NodeItem<T> {
        return {
            data: this.data,
            hasChildren: this.children.length > 0
        };
    }
}
