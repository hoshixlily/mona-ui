import { PreventableEvent } from "../../../utils/PreventableEvent";
import { NodeItem } from "./NodeItem";
import { TreeNode } from "./TreeNode";

export class NodeClickEvent<T> extends PreventableEvent {
    readonly #node: TreeNode<T>;
    public constructor(node: TreeNode<T>, event: MouseEvent) {
        super("nodeClick", event);
        this.#node = node;
    }

    public get nodeItem(): NodeItem<T> {
        return {
            data: this.#node.data
        };
    }
}
