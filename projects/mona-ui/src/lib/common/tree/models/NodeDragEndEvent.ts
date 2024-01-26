import { NodeEvent } from "./NodeEvent";
import { TreeNode } from "./TreeNode";

export class NodeDragEndEvent<T> extends NodeEvent<T> {
    public constructor(node: TreeNode<T>, event: MouseEvent | TouchEvent) {
        super("nodeDragEnd", node, event);
    }
}
