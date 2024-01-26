import { TreeNode } from "./TreeNode";

export interface TreeNodeCheckEvent<T> {
    checked: boolean;
    node: TreeNode<T>;
}
