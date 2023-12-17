import { NodeCheckOptions } from "./NodeCheckOptions";
import { NodeLookupItem } from "./NodeLookupItem";
import { v4 } from "uuid";
import { signal, WritableSignal } from "@angular/core";

export interface NodeOptions<T = any> {
    checked?: boolean;
    data?: T;
    disabled?: boolean;
    expanded?: boolean;
    indeterminate?: boolean;
    index: number;
    key: string;
    nodes?: NodeOptions<T>[];
    parent?: Node<T>;
    selected?: boolean;
    text?: string;
}

export interface NodeState {
    checked: WritableSignal<boolean>;
    expanded: WritableSignal<boolean>;
    indeterminate: WritableSignal<boolean>;
    selected: WritableSignal<boolean>;
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
        checked: signal(false),
        expanded: signal(false),
        indeterminate: signal(false),
        selected: signal(false)
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
        this.state.checked.set(options.checked ?? false);
        this.state.expanded.set(options.expanded ?? false);
        this.state.indeterminate.set(options.indeterminate ?? false);
        this.state.selected.set(options.selected ?? false);
    }

    public anyParentCollapsed(): boolean {
        if (this.parent) {
            return !this.parent.state.expanded() || this.parent.anyParentCollapsed();
        }
        return false;
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
