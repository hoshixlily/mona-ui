import { computed, EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { aggregate, Dictionary, EnumerableSet, sequenceEqual, SortedSet } from "@mirei/ts-collections";
import { debounceTime, distinctUntilChanged, ReplaySubject } from "rxjs";
import { FilterChangeEvent } from "../../common/models/FilterChangeEvent";
import { CheckableOptions } from "../models/CheckableOptions";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { FilterableOptions } from "../models/FilterableOptions";
import { Node } from "../models/Node";
import { NodeCheckOptions } from "../models/NodeCheckOptions";
import { NodeDisabler, NodeDisablerAction } from "../models/NodeDisabler";
import { SelectableOptions } from "../models/SelectableOptions";

@Injectable()
export class TreeViewService {
    public readonly checkableOptions: Required<CheckableOptions> = {
        checkChildren: true,
        mode: "multiple",
        checkParents: true,
        enabled: false
    };
    public readonly expandableOptions: Required<ExpandableOptions> = {
        enabled: false
    };
    public readonly filterableOptions: Required<FilterableOptions> = {
        caseSensitive: false,
        debounce: 0,
        enabled: false,
        operator: "contains"
    };
    public readonly filter$: ReplaySubject<string> = new ReplaySubject<string>(1);
    public readonly filterPlaceholder: WritableSignal<string> = signal("");
    public readonly filterText: Signal<string> = toSignal(
        this.filter$.pipe(debounceTime(this.filterableOptions.debounce), distinctUntilChanged()),
        {
            initialValue: ""
        }
    );
    public readonly nodeDictionary: Signal<Dictionary<string, Node>> = computed(() => {
        const nodeDict = new Dictionary<string, Node>();
        this.prepareNodeDictionary(this.nodeList(), nodeDict);
        return nodeDict;
    });
    public readonly nodeList: WritableSignal<Node[]> = signal([]);
    public readonly selectableOptions: Required<SelectableOptions> = {
        childrenOnly: false,
        enabled: false,
        mode: "single"
    };
    public readonly viewNodeList: Signal<Node[]> = computed(() => {
        if (this.filterText()) {
            return this.filterTree(this.nodeList(), this.filterText());
        }
        return this.nodeList();
    });
    public checkedKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public checkedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public disabledKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public expandedKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public expandedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();
    public lastSelectedNode?: Node;
    public selectedKeys: EnumerableSet<string> = new EnumerableSet<string>();
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    public constructor() {}

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
        for (const [uid, node] of this.nodeDictionary().entries()) {
            node.state.checked = checkedKeySet.contains(node.key);
        }
        for (const node of this.nodeDictionary().values()) {
            if (node.nodes.length > 0) {
                if (this.checkableOptions.checkChildren && checkedKeySet.contains(node.key)) {
                    this.checkNode(node, { checked: true, checkChildren: true, checkParent: false });
                }
                if (this.checkableOptions.checkParents) {
                    node.state.indeterminate =
                        !node.state.checked &&
                        node.nodes.some(childNode => childNode.state.checked || childNode.state.indeterminate);
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
            const node = this.nodeDictionary().firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                this.expandNode(node, true, false, false);
            }
        }
    }

    public loadSelectedKeys(selectedKeys: Iterable<string>): void {
        const selectedKeySet = new SortedSet(selectedKeys);
        for (const key of selectedKeySet) {
            const node = this.nodeDictionary().firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                node.state.selected = true;
                this.lastSelectedNode = node;
            }
        }
    }

    public setCheckableOptions(options: CheckableOptions): void {
        Object.assign(this.checkableOptions, options);
    }

    public setExpandableOptions(options: ExpandableOptions): void {
        Object.assign(this.expandableOptions, options);
    }

    public setFilterableOptions(options: FilterableOptions): void {
        Object.assign(this.filterableOptions, options);
    }

    public setNodeCheck(node: Node, checked: boolean): void {
        if (node.disabled) {
            return;
        }
        if (this.checkableOptions?.mode === "single") {
            this.uncheckAllNodes();
        }
        this.checkNode(node, {
            checked,
            checkChildren: this.checkableOptions?.checkChildren,
            checkParent: this.checkableOptions?.checkParents
        });
        this.emitCheckedKeys();
    }

    public setNodeExpand(node: Node, expand: boolean): void {
        if (node.nodes.length === 0) {
            return;
        }
        this.expandNode(node, expand, false, true);
        this.emitExpandedKeys();
    }

    public setSelectableOptions(options: SelectableOptions): void {
        Object.assign(this.selectableOptions, options);
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
        if (node.state.selected) {
            node.state.selected = false;
            this.lastSelectedNode = undefined;
        } else {
            if (this.selectableOptions.mode === "single") {
                if (this.lastSelectedNode) {
                    this.lastSelectedNode.state.selected = false;
                }
            }
            node.state.selected = true;
            node.focused.set(true);
            this.lastSelectedNode = node;
        }
        const selectedKeys = this.nodeDictionary()
            .where(n => n.value.state.selected)
            .select(n => n.value.key)
            .toArray();
        this.selectedKeysChange.emit(selectedKeys);
    }

    public uncheckAllNodes(): void {
        this.nodeList().forEach(node =>
            this.checkNode(node, { checked: false, checkChildren: true, checkParent: true })
        );
    }

    public updateNodeCheckStatus(node: Node): void {
        if (node.nodes.length > 0) {
            const allChecked = node.nodes.every(childNode => childNode.state.checked);
            const someChecked = node.nodes.some(childNode => childNode.state.checked);
            const someIndeterminate = node.nodes.some(childNode => childNode.state.indeterminate);
            node.state.checked = allChecked;
            node.state.indeterminate = someIndeterminate || (!allChecked && someChecked);
        } else {
            node.state.indeterminate = false;
        }
        let parent = node.parent;
        while (parent) {
            const allChecked = parent.nodes.every(childNode => childNode.state.checked);
            const someChecked = parent.nodes.some(childNode => childNode.state.checked);
            const someIndeterminate = parent.nodes.some(childNode => childNode.state.indeterminate);
            parent.state.checked = allChecked;
            parent.state.indeterminate = someIndeterminate || (!allChecked && someChecked);
            parent = parent.parent;
        }
        this.emitCheckedKeys();
    }

    public updateNodeIndices(): void {
        const flattenedNodes = TreeViewService.flattenNodes(this.nodeList());
        flattenedNodes.forEach((node, index) => (node.index = index));
    }

    private checkNode(node: Node, options: NodeCheckOptions): void {
        // node.checked = options.checked;
        node.state.checked = options.checked;
        if (options.checkChildren) {
            // if (node.checked && node.expanded) {
            //     node.nodes.forEach(childNode => this.checkNode(childNode, options));
            // } else if (!node.checked && node.expanded) {
            //     node.nodes.forEach(childNode => this.checkNode(childNode, { ...options, checked: false }));
            // } else if (!node.checked && !node.expanded) {
            //     node.nodes.forEach(childNode => this.checkNode(childNode, { ...options, checked: false }));
            // }
            node.nodes.forEach(childNode => this.checkNode(childNode, options));
        }
        if (options.checkParent && node.parent) {
            const parent = node.parent;
            const siblings = parent.nodes;
            const checkedSiblings = siblings.filter(sibling => sibling.state.checked);
            const indeterminateSiblings = siblings.filter(sibling => sibling.state.indeterminate);
            const allSiblingsChecked = checkedSiblings.length === siblings.length;
            const someSiblingsChecked = checkedSiblings.length > 0;
            const someSiblingsIndeterminate = indeterminateSiblings.length > 0;
            parent.state.indeterminate = !allSiblingsChecked && (someSiblingsChecked || someSiblingsIndeterminate);
            this.checkNode(parent, { checked: allSiblingsChecked, checkChildren: false, checkParent: true });
        }
    }

    private emitCheckedKeys(): void {
        const checkedKeys = this.nodeDictionary()
            .where(n => n.value.state.checked)
            .select(n => n.value.key)
            .orderBy(key => key);
        const previousCheckedKeys = this.checkedKeys.orderBy(key => key);
        const equal = sequenceEqual(checkedKeys, previousCheckedKeys);
        if (!equal) {
            this.checkedKeysChange.emit(checkedKeys.toArray());
        }
    }

    private emitExpandedKeys(): void {
        const expandedKeys = this.nodeDictionary()
            .where(n => n.value.state.expanded)
            .select(n => n.value.key)
            .orderBy(key => key);
        const previousExpandedKeys = this.expandedKeys.orderBy(key => key);
        const equal = sequenceEqual(expandedKeys, previousExpandedKeys);
        if (!equal) {
            this.expandedKeysChange.emit(expandedKeys.toArray());
        }
    }

    private expandAllParents(node: Node): void {
        if (node.parent) {
            node.parent.state.expanded = true;
            this.expandAllParents(node.parent);
        }
    }

    private expandNode(node: Node, expand: boolean, expandChildren: boolean, checkChildren: boolean): void {
        node.state.expanded = expand;
        // if (node.checked && checkChildren) {
        //     this.toggleNodeCheck(node, true);
        // }
        if (expandChildren) {
            node.nodes.forEach(childNode => this.expandNode(childNode, expand, expandChildren, checkChildren));
        }
    }

    private filterTree(nodes: Node[], filterText: string): Node[] {
        return aggregate(
            nodes,
            (result, node) => {
                if (this.isFiltered(node.text, filterText)) {
                    result.push(node);
                    // this.expandAllParents(node);
                } else if (node.nodes && node.nodes.length > 0) {
                    const newNodes = this.filterTree(node.nodes, filterText);
                    if (newNodes.length > 0) {
                        const clone = node.cloneForFilter();
                        clone.nodes = newNodes;
                        result.push(clone);
                    }
                }
                return result;
            },
            [] as Node[]
        );
    }

    private isFiltered(nodeText: string, filterText: string): boolean {
        const text = this.filterableOptions.caseSensitive ? nodeText : nodeText.toLowerCase();
        const filter = this.filterableOptions.caseSensitive ? filterText : filterText.toLowerCase();
        const operator = this.filterableOptions.operator;
        if (typeof operator === "function") {
            return operator(text, filter);
        }
        if (operator === "contains") {
            return text.indexOf(filter) >= 0;
        }
        if (operator === "endsWith") {
            return text.endsWith(filter);
        }
        if (operator === "startsWith") {
            return text.startsWith(filter);
        }
        return text.indexOf(filter) >= 0;
    }

    private prepareNodeDictionary(nodes: Node[], nodeDict: Dictionary<string, Node>): void {
        for (const node of nodes) {
            nodeDict.add(node.uid, node);
            if (node.nodes.length > 0) {
                this.prepareNodeDictionary(node.nodes, nodeDict);
            }
        }
    }
}
