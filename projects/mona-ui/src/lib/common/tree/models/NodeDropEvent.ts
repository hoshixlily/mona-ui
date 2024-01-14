import { DropPosition } from "./DropPositionChangeEvent";
import { NodeEvent } from "./NodeEvent";
import { NodeItem } from "./NodeItem";
import { TreeNode } from "./TreeNode";

export class NodeDropEvent<T> extends NodeEvent<T> {
    readonly #position: DropPosition;
    readonly #targetNode: TreeNode<T>;
    public constructor(
        node: TreeNode<T>,
        targetNode: TreeNode<T>,
        position: DropPosition,
        event: MouseEvent | TouchEvent
    ) {
        super("nodeDrop", node, event);
        this.#position = position;
        this.#targetNode = targetNode;
    }

    public get position(): DropPosition {
        return this.#position;
    }

    public get targetNodeItem(): NodeItem<T> {
        return this.#targetNode.nodeItem;
    }
}
