import { EventEmitter, Injectable } from "@angular/core";
import { CheckableOptions } from "../data/CheckableOptions";
import { Dictionary, SortedSet } from "@mirei/ts-collections";
import { Node } from "../data/Node";
import { SelectableOptions } from "../data/SelectableOptions";

@Injectable()
export class TreeViewService {
    public checkableOptions: CheckableOptions = {
        checkChildren: true,
        mode: "multiple",
        checkParents: true,
        enabled: false
    };
    public checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public lastSelectedNode?: Node;
    public nodeDictionary: Dictionary<string, Node> = new Dictionary<string, Node>();
    public nodeList: Node[] = [];
    public selectableOptions: SelectableOptions = {
        childrenOnly: false,
        enabled: false,
        mode: "single"
    };
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public viewNodeList: Node[] = [];

    public constructor() {}

    public loadCheckedKeys(checkedKeys: Iterable<string>): void {
        const checkedKeySet = new SortedSet(checkedKeys);
        for (const [uid, node] of this.nodeDictionary.entries()) {
            node.checked = checkedKeySet.contains(node.key);
        }
        for (const node of this.nodeDictionary.values()) {
            if (node.nodes.length > 0) {
                if (this.checkableOptions.checkChildren && checkedKeySet.contains(node.key)) {
                    node.check({ checked: true, checkChildren: true, checkParent: false });
                }
                if (this.checkableOptions.checkParents) {
                    node.indeterminate =
                        !node.checked && node.nodes.some(childNode => childNode.checked || childNode.indeterminate);
                }
            }
        }
    }

    public loadExpandedKeys(expandedKeys: Iterable<string>): void {
        const expandedKeySet = new SortedSet(expandedKeys);
        for (const key of expandedKeySet) {
            const node = this.nodeDictionary.firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                node.expand(true);
            }
        }
    }

    public loadSelectedKeys(selectedKeys: Iterable<string>): void {
        const selectedKeySet = new SortedSet(selectedKeys);
        for (const key of selectedKeySet) {
            const node = this.nodeDictionary.firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                node.setSelected(true);
            }
        }
    }

    public setCheckableOptions(options: CheckableOptions): void {
        this.checkableOptions = { ...this.checkableOptions, ...options };
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }

    public uncheckAllNodes(): void {
        this.nodeList.forEach(node => node.check({ checked: false, checkChildren: true, checkParent: true }));
    }

    public unselectAllNodes(): void {
        for (const [key, node] of this.nodeDictionary.entries()) {
            node.setSelected(false);
        }
    }
}
