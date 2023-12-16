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

export class Node<T = any> {
    public readonly uid: string = v4();
    public checked: boolean = false;
    public data?: T;
    public disabled: boolean = false;
    public expanded: boolean = false;
    public focused: WritableSignal<boolean> = signal(false);
    public indeterminate: boolean = false;
    public index: number = 0;
    public key: string;
    public nodes: Node<T>[] = [];
    public parent?: Node<T>;
    public selected: boolean = false;
    public text: string = "";
    public constructor(options: NodeOptions<T>) {
        this.checked = options.checked ?? false;
        this.data = options.data;
        this.disabled = options.disabled ?? false;
        this.expanded = options.expanded ?? false;
        this.indeterminate = options.indeterminate ?? false;
        this.index = options.index;
        this.key = options.key;
        this.nodes = options.nodes?.map(node => new Node(node)) ?? [];
        this.parent = options.parent;
        this.selected = options.selected ?? false;
        this.text = options.text ?? "";
    }

    public anyParentCollapsed(): boolean {
        if (this.parent) {
            return !this.parent.expanded || this.parent.anyParentCollapsed();
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

    public setSelected(selected: boolean): void {
        this.selected = selected;
    }
}
