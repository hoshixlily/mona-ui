import { TreeNode } from "./TreeNode";

export type DropPosition = "before" | "after" | "inside" | "outside";

export interface DropPositionChangeEvent<T> {
    position: DropPosition;
    // sourceNode: TreeNode<T>;
    targetNode: TreeNode<T> | null;
}
