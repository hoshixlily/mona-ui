import { NodeCheckOptions } from "./NodeCheckOptions";
import { NodeLookupItem } from "./NodeLookupItem";

export interface NodeOptions<T = any> {
    checked?: boolean;
    data?: T;
    disabled?: boolean;
    expanded?: boolean;
    indeterminate?: boolean;
    key: string;
    nodes?: NodeOptions<T>[];
    parent?: Node<T>;
    selected?: boolean;
    text?: string;
}

export class Node<T = any> {
    public readonly uid: string = crypto.randomUUID();
    public checked: boolean = false;
    public data?: T;
    public disabled: boolean = false;
    public expanded: boolean = false;
    public indeterminate: boolean = false;
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
        this.key = options.key;
        this.nodes = options.nodes?.map(node => new Node(node)) ?? [];
        this.parent = options.parent;
        this.selected = options.selected ?? false;
        this.text = options.text ?? "";
    }

    public check(options: NodeCheckOptions): void {
        this.checked = options.checked;
        if (options.checkChildren) {
            this.nodes.forEach(node => node.check(options));
        }
        if (options.checkParent) {
            const siblings = this.parent?.nodes ?? [];
            const checkedSiblings = siblings.filter(sibling => sibling.checked);
            const indeterminateSiblings = siblings.filter(sibling => sibling.indeterminate);
            const allSiblingsChecked = checkedSiblings.length === siblings.length;
            const someSiblingsChecked = checkedSiblings.length > 0;
            const someSiblingsIndeterminate = indeterminateSiblings.length > 0;
            const parent = this.parent;
            if (parent) {
                parent.indeterminate = !allSiblingsChecked && (someSiblingsChecked || someSiblingsIndeterminate);
                parent.check({ checked: allSiblingsChecked, checkChildren: false, checkParent: true });
            }
        }
    }

    public expand(expanded: boolean, expandChildren: boolean = false): void {
        this.expanded = expanded;
        if (expandChildren) {
            this.nodes.forEach(node => node.expand(expanded, expandChildren));
        }
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
