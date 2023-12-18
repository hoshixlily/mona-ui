import { signal, WritableSignal } from "@angular/core";
import { v4 } from "uuid";
import { NodeLookupItem } from "./NodeLookupItem";

export interface NodeOptions<T = any> {
    data?: T;
    disabled?: boolean;
    index: number;
    key: string;
    nodes?: NodeOptions<T>[];
    parent?: Node<T>;
    text?: string;
}

export interface NodeState {
    checked: boolean;
    expanded: boolean;
    indeterminate: boolean;
    selected: boolean;
}

export class Node<T = any> {
    public readonly uid: string = v4();
    public data?: T;
    public disabled: boolean = false;
    public focused: WritableSignal<boolean> = signal(false);
    public index: number = 0;
    public key: string;
    public nodes: Node<T>[] = [];
    public parent?: Node<T>;
    public state: NodeState = {
        checked: false,
        expanded: false,
        indeterminate: false,
        selected: false
    };
    public text: string = "";

    public constructor(options: NodeOptions<T>) {
        this.data = options.data;
        this.disabled = options.disabled ?? false;
        this.index = options.index;
        this.key = options.key;
        this.nodes = options.nodes?.map(node => new Node(node)) ?? [];
        this.parent = options.parent;
        this.text = options.text ?? "";
    }

    public anyParentCollapsed(): boolean {
        if (this.parent) {
            return !this.parent.state.expanded || this.parent.anyParentCollapsed();
        }
        return false;
    }

    public cloneForFilter(): Node<T> {
        const node = new Node<T>({
            data: this.data,
            disabled: this.disabled,
            index: this.index,
            key: this.key,
            nodes: this.nodes.map(node => node.cloneForFilter()),
            parent: this.parent,
            text: this.text
        });
        node.state = this.state;
        return node;
    }

    public isDescendantOf(node: Node): boolean {
        if (this.parent) {
            return this.parent === node || this.parent.isDescendantOf(node);
        }
        return false;
    }

    public getLookupItem(): NodeLookupItem<T> {
        return new NodeLookupItem(this);
    }
}
