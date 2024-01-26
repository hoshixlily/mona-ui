import { TreeNode } from "./TreeNode";

export interface TreeNodeSelectEvent<T> {
    node: TreeNode<T>;
    selected: boolean;
}
