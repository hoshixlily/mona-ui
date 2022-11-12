import { EventEmitter, Injectable } from "@angular/core";
import { CheckableOptions } from "../data/CheckableOptions";
import { Dictionary, EnumerableSet, SortedSet } from "@mirei/ts-collections";
import { Node } from "../data/Node";
import { SelectableOptions } from "../data/SelectableOptions";
import { NodeDisabler, NodeDisablerAction } from "../data/NodeDisabler";
import { Subject } from "rxjs";
import { CdkDragStart } from "@angular/cdk/drag-drop";

@Injectable()
export class TreeViewService {
    public checkableOptions: CheckableOptions = {
        checkChildren: true,
        mode: "multiple",
        checkParents: true,
        enabled: false
    };
    public checkedKeys: EnumerableSet<string> = new EnumerableSet<string>();
    public checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public disabledKeys: EnumerableSet<string> = new EnumerableSet<string>();
    public expandedKeys: EnumerableSet<string> = new EnumerableSet<string>();
    public expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public lastSelectedNode?: Node;
    public nodeDictionary: Dictionary<string, Node> = new Dictionary<string, Node>();
    public nodeList: Node[] = [];
    public selectableOptions: SelectableOptions = {
        childrenOnly: false,
        enabled: false,
        mode: "single"
    };
    public selectedKeys: EnumerableSet<string> = new EnumerableSet<string>();
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public viewNodeList: Node[] = [];

    public constructor() {}

    public static getNodeDisablerAction(disabler: NodeDisabler): NodeDisablerAction {
        if (typeof disabler === "string") {
            return (item: any): boolean => !!item?.[disabler] ?? false;
        }
        return disabler;
    }

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

    public loadDisabledKeys(disabledKeys: Iterable<string>): void {
        const disabledKeySet = new SortedSet(disabledKeys);
        const disable = (node: Node, disabled?: boolean): void => {
            node.disabled = disabled ?? disabledKeySet.contains(node.key);
            if (!node.disabled && disabled == null) {
                node.nodes.forEach(childNode => disable(childNode));
            } else if (!node.disabled) {
                node.nodes.forEach(childNode => disable(childNode, false));
            } else {
                node.nodes.forEach(childNode => disable(childNode, true));
            }
        };
        for (const node of this.nodeList) {
            disable(node);
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

    public toggleNodeCheck(node: Node, checked?: boolean): void {
        if (node.disabled) {
            return;
        }
        if (this.checkableOptions?.mode === "single") {
            this.uncheckAllNodes();
        }
        node.check({
            checked: checked ?? !node.checked,
            checkChildren: this.checkableOptions?.checkChildren,
            checkParent: this.checkableOptions?.checkParents
        });
        const checkedKeys = this.nodeDictionary
            .where(n => n.value.checked)
            .select(n => n.value.key)
            .toArray();
        this.checkedKeysChange.emit(checkedKeys);
    }

    public toggleNodeExpand(node: Node, expand?: boolean): void {
        if (node.nodes.length === 0) {
            return;
        }
        node.expand(expand ?? !node.expanded, false);
        const expandedKeys = this.nodeDictionary
            .where(n => n.value.expanded)
            .select(n => n.value.key)
            .toArray();
        this.expandedKeysChange.emit(expandedKeys);
    }

    public toggleNodeSelection(node: Node): void {
        if (!this.selectableOptions.enabled) {
            return;
        }
        if (this.selectableOptions.childrenOnly && node.nodes.length > 0) {
            return;
        }
        if (node.disabled) {
            return;
        }
        if (node.selected) {
            node.setSelected(false);
            this.lastSelectedNode = undefined;
        } else {
            if (this.selectableOptions.mode === "single") {
                if (this.lastSelectedNode) {
                    this.lastSelectedNode.setSelected(false);
                }
            }
            node.setSelected(true);
            node.focused = true;
            this.lastSelectedNode = node;
        }
        const selectedKeys = this.nodeDictionary
            .where(n => n.value.selected)
            .select(n => n.value.key)
            .toArray();
        this.selectedKeysChange.emit(selectedKeys);
    }

    public uncheckAllNodes(): void {
        this.nodeList.forEach(node => node.check({ checked: false, checkChildren: true, checkParent: true }));
    }

    public updateNodeCheckStatus(node: Node): void {
        if (node.nodes.length > 0) {
            const allChecked = node.nodes.every(childNode => childNode.checked);
            const someChecked = node.nodes.some(childNode => childNode.checked);
            const someIndeterminate = node.nodes.some(childNode => childNode.indeterminate);
            node.checked = allChecked;
            node.indeterminate = someIndeterminate || (!allChecked && someChecked);
        } else {
            node.indeterminate = false;
        }
        let parent = node.parent;
        while (parent) {
            const allChecked = parent.nodes.every(childNode => childNode.checked);
            const someChecked = parent.nodes.some(childNode => childNode.checked);
            const someIndeterminate = parent.nodes.some(childNode => childNode.indeterminate);
            parent.checked = allChecked;
            parent.indeterminate = someIndeterminate || (!allChecked && someChecked);
            parent = parent.parent;
        }
        const checkedKeys = this.nodeDictionary
            .where(n => n.value.checked)
            .select(n => n.value.key)
            .toArray();
        this.checkedKeysChange.emit(checkedKeys);
    }
}
