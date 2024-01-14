import { NodeEvent } from "./NodeEvent";
import { TreeNode } from "./TreeNode";

export class NodeDragStartEvent<T> extends NodeEvent<T> {
    public constructor(node: TreeNode<T>, event: MouseEvent | TouchEvent) {
        super("nodeDragStart", node, event);
    }
}
