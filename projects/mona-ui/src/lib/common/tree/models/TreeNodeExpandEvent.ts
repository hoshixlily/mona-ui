import { TreeNode } from "./TreeNode";

export interface TreeNodeExpandEvent<T> {
    expanded: boolean;
    node: TreeNode<T>;
}
