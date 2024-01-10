import { TreeNode } from "./TreeNode";

export interface NodeExpandEvent<T> {
    expanded: boolean;
    node: TreeNode<T>;
}
