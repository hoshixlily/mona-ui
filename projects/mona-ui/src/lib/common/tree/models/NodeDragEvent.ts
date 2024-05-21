import { NodeItem } from "./NodeItem";
import { TreeNode } from "./TreeNode";

export class NodeDragEvent<T> {
    readonly #event: MouseEvent | TouchEvent;
    readonly #node: TreeNode<T>;
    readonly #targetNode: TreeNode<T> | null;
    readonly #type: string = "nodeDrag";
    public constructor(node: TreeNode<T>, targetNode: TreeNode<T> | null, event: MouseEvent | TouchEvent) {
        this.#node = node;
        this.#event = event;
        this.#targetNode = targetNode;
    }

    public get nodeItem(): NodeItem<T> {
        return this.#node.nodeItem;
    }

    public get originalEvent(): MouseEvent | TouchEvent {
        return this.#event;
    }

    public get targetNodeItem(): NodeItem<T> | null {
        return this.#targetNode?.nodeItem ?? null;
    }

    public get type(): string {
        return this.#type;
    }
}

export class InternalNodeDragEvent<T> {
    readonly #dragEvent: NodeDragEvent<T>;
    readonly #dropAllowed: boolean;

    public constructor(dragEvent: NodeDragEvent<T>, dropAllowed: boolean) {
        this.#dragEvent = dragEvent;
        this.#dropAllowed = dropAllowed;
    }

    public get dragEvent(): NodeDragEvent<T> {
        return this.#dragEvent;
    }

    public get dropAllowed(): boolean {
        return this.#dropAllowed;
    }
}
