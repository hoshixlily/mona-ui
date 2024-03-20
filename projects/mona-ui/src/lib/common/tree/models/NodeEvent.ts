import { PreventableEvent } from "../../../utils/PreventableEvent";
import { NodeItem } from "./NodeItem";
import { TreeNode } from "./TreeNode";

export abstract class NodeEvent<T> extends PreventableEvent<MouseEvent | TouchEvent> {
    readonly #node: TreeNode<T>;
    protected constructor(type: string, node: TreeNode<T>, event: MouseEvent | TouchEvent) {
        super(type, event);
        this.#node = node;
    }
    public get nodeItem(): NodeItem<T> {
        return {
            data: this.#node.data,
            hasChildren: this.#node.children().length > 0
        };
    }
}
