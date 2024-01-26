import { TreeNode } from "./TreeNode";

export type DropPosition = "before" | "after" | "inside" | "outside";

export interface DropPositionChangeEvent<T> {
    position: DropPosition;
    targetNode: TreeNode<T> | null;
}
