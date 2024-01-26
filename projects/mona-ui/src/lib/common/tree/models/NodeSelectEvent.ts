import { PreventableEvent } from "../../../utils/PreventableEvent";
import { NodeItem } from "./NodeItem";
import { TreeNode } from "./TreeNode";

export class NodeSelectEvent<T> extends PreventableEvent {
    readonly #node: TreeNode<T>;

    public constructor(node: TreeNode<T>, event: MouseEvent | KeyboardEvent) {
        super("nodeSelect", event);
        this.#node = node;
    }

    public get nodeItem(): NodeItem<T> {
        return {
            data: this.#node.data,
            hasChildren: this.#node.children.length > 0
        };
    }
}
