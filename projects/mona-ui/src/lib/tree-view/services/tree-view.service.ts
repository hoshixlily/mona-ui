import { computed, EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Dictionary, EnumerableSet, SortedSet } from "@mirei/ts-collections";
import { CheckableOptions } from "../models/CheckableOptions";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { Node } from "../models/Node";
import { NodeCheckOptions } from "../models/NodeCheckOptions";
import { NodeDisabler, NodeDisablerAction } from "../models/NodeDisabler";
import { SelectableOptions } from "../models/SelectableOptions";

@Injectable()
export class TreeViewService {
    public checkableOptions: CheckableOptions = {
        checkChildren: true,
        mode: "multiple",
        checkParents: true,
        enabled: false
    };
    public checkedKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public checkedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public disabledKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public expandableOptions: ExpandableOptions = {
        enabled: false
    };
    public expandedKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public expandedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public lastSelectedNode?: Node;
    public nodeDictionary: Dictionary<string, Node> = new Dictionary<string, Node>();
    public nodeList: WritableSignal<Node[]> = signal([]);
    public selectableOptions: SelectableOptions = {
        childrenOnly: false,
        enabled: false,
        mode: "single"
    };
    public selectedKeys: EnumerableSet<string> = new EnumerableSet<string>();
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public viewNodeList: Signal<Node[]> = computed(() => {
        return this.nodeList();
    });

    public constructor() {}

    private static checkNode(node: Node, options: NodeCheckOptions): void {
        node.checked = options.checked;
        if (options.checkChildren) {
            node.nodes.forEach(childNode => this.checkNode(childNode, options));
        }
        if (options.checkParent && node.parent) {
            const parent = node.parent;
            const siblings = parent.nodes;
            const checkedSiblings = siblings.filter(sibling => sibling.checked);
            const indeterminateSiblings = siblings.filter(sibling => sibling.indeterminate);
            const allSiblingsChecked = checkedSiblings.length === siblings.length;
            const someSiblingsChecked = checkedSiblings.length > 0;
            const someSiblingsIndeterminate = indeterminateSiblings.length > 0;
            parent.indeterminate = !allSiblingsChecked && (someSiblingsChecked || someSiblingsIndeterminate);
            TreeViewService.checkNode(parent, { checked: allSiblingsChecked, checkChildren: false, checkParent: true });
        }
    }

    private static expandNode(node: Node, expand: boolean, expandChildren: boolean): void {
        node.expanded = expand;
        if (expandChildren) {
            node.nodes.forEach(childNode => TreeViewService.expandNode(childNode, expand, expandChildren));
        }
    }

    public static flattenNodes(nodes: Node[]): Node[] {
        const flattenedNodeList: Node[] = [];
        nodes.forEach(node => {
            flattenedNodeList.push(node);
            if (node.nodes.length > 0) {
                flattenedNodeList.push(...TreeViewService.flattenNodes(node.nodes));
            }
        });
        return flattenedNodeList;
    }

    public static getNodeDisablerAction(disabler: NodeDisabler): NodeDisablerAction {
        if (typeof disabler === "string") {
            return (item: any): boolean => !!item?.[disabler] ?? false;
        }
        return disabler;
    }

    public loadCheckedKeys(checkedKeys: Iterable<unknown>): void {
        const checkedKeySet = new SortedSet(checkedKeys);
        for (const [uid, node] of this.nodeDictionary.entries()) {
            node.checked = checkedKeySet.contains(node.key);
        }
        for (const node of this.nodeDictionary.values()) {
            if (node.nodes.length > 0) {
                if (this.checkableOptions.checkChildren && checkedKeySet.contains(node.key)) {
                    TreeViewService.checkNode(node, { checked: true, checkChildren: true, checkParent: false });
                }
                if (this.checkableOptions.checkParents) {
                    node.indeterminate =
                        !node.checked && node.nodes.some(childNode => childNode.checked || childNode.indeterminate);
                }
            }
        }
    }

    public loadDisabledKeys(disabledKeys: Iterable<unknown>): void {
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
        for (const node of this.nodeList()) {
            disable(node);
        }
    }

    public loadExpandedKeys(expandedKeys: Iterable<unknown>): void {
        const expandedKeySet = new SortedSet(expandedKeys);
        for (const key of expandedKeySet) {
            const node = this.nodeDictionary.firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                TreeViewService.expandNode(node, true, false);
            }
        }
    }

    public loadSelectedKeys(selectedKeys: Iterable<string>): void {
        const selectedKeySet = new SortedSet(selectedKeys);
        for (const key of selectedKeySet) {
            const node = this.nodeDictionary.firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                node.setSelected(true);
                this.lastSelectedNode = node;
            }
        }
    }

    public setCheckableOptions(options: CheckableOptions): void {
        this.checkableOptions = { ...this.checkableOptions, ...options };
    }

    public setExpandableOptions(options: ExpandableOptions): void {
        this.expandableOptions = { ...this.expandableOptions, ...options };
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
        TreeViewService.checkNode(node, {
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

    public toggleNodeExpand(node: Node, expand: boolean): void {
        if (node.nodes.length === 0) {
            return;
        }
        TreeViewService.expandNode(node, expand, false);
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
            node.focused.set(true);
            this.lastSelectedNode = node;
        }
        const selectedKeys = this.nodeDictionary
            .where(n => n.value.selected)
            .select(n => n.value.key)
            .toArray();
        this.selectedKeysChange.emit(selectedKeys);
    }

    public uncheckAllNodes(): void {
        this.nodeList().forEach(node =>
            TreeViewService.checkNode(node, { checked: false, checkChildren: true, checkParent: true })
        );
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

    public updateNodeIndices(): void {
        const flattenedNodes = TreeViewService.flattenNodes(this.nodeList());
        flattenedNodes.forEach((node, index) => (node.index = index));
    }
}
