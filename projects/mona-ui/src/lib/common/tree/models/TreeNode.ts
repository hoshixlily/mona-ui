import { List } from "@mirei/ts-collections";
import { v4 } from "uuid";

export class TreeNode<T> {
    public readonly data: T;
    public readonly uid: string = v4();
    public children: List<TreeNode<T>> = new List();
    // public index: number = 0;
    public parent: TreeNode<T> | null = null;

    public constructor(data: T) {
        this.data = data;
    }
}
