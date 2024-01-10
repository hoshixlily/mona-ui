import { TreeNode } from "./TreeNode";

export interface NodeCheckEvent<T> {
    checked: boolean;
    node: TreeNode<T>;
}
