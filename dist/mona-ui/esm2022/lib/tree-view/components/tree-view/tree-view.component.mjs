import { Component, ContentChild, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChildren } from "@angular/core";
import { Node } from "../../data/Node";
import { Enumerable, List } from "@mirei/ts-collections";
import { TreeViewService } from "../../services/tree-view.service";
import { TreeViewNodeTextTemplateDirective } from "../../directives/tree-view-node-text-template.directive";
import { faArrowDown, faArrowUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NodeDragStartEvent } from "../../data/NodeDragStartEvent";
import { NodeDragEvent } from "../../data/NodeDragEvent";
import { NodeDropEvent } from "../../data/NodeDropEvent";
import { NodeDragEndEvent } from "../../data/NodeDragEndEvent";
import { TreeViewNodeComponent } from "../tree-view-node/tree-view-node.component";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { filter, fromEvent, Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "../../services/tree-view.service";
import * as i2 from "@angular/common";
import * as i3 from "@fortawesome/angular-fontawesome";
import * as i4 from "@angular/cdk/drag-drop";
import * as i5 from "../tree-view-node/tree-view-node.component";
export class TreeViewComponent {
    set nodeDisabler(nodeDisabler) {
        this.disabler = nodeDisabler;
        this.updateDisabledState();
    }
    constructor(cdr, elementRef, treeViewService) {
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.treeViewService = treeViewService;
        this.componentDestroy$ = new Subject();
        this.dropAfterIcon = faArrowDown;
        this.dropBeforeIcon = faArrowUp;
        this.dropInsideIcon = faPlus;
        this.dragging = false;
        this.childrenField = "";
        this.data = [];
        this.keyField = "";
        this.nodeClick = new EventEmitter();
        this.nodeComponents = new QueryList();
        this.nodeDoubleClick = new EventEmitter();
        this.nodeDrag = new EventEmitter();
        this.nodeDragEnd = new EventEmitter();
        this.nodeDragStart = new EventEmitter();
        this.nodeDrop = new EventEmitter();
        this.nodeTextTemplate = null;
        this.textField = "";
    }
    flattenComponents() {
        const flatten = (items) => {
            const flat = [];
            items.forEach(item => {
                flat.push(item);
                if (item.nodes.length > 0) {
                    flat.push(...flatten(item.nodes));
                }
            });
            return flat;
        };
        const flatNodes = flatten(this.treeViewService.viewNodeList);
        const flatComponents = [];
        flatNodes.forEach(node => {
            const component = this.nodeComponents.find(c => c.node.uid === node.uid);
            if (component) {
                flatComponents.push(component);
            }
        });
        return flatComponents;
    }
    ngAfterViewInit() {
        const flatComponents = this.flattenComponents();
        this.keyManager = new ActiveDescendantKeyManager(flatComponents).skipPredicate(n => n.node.disabled || n.node.anyParentCollapsed());
        this.nodeComponents.changes.subscribe(result => {
            const lastActiveItem = this.keyManager?.activeItem;
            this.keyManager = new ActiveDescendantKeyManager(flatComponents).skipPredicate(n => n.node.disabled || n.node.anyParentCollapsed());
            if (lastActiveItem) {
                this.keyManager?.setActiveItem(lastActiveItem);
            }
            else {
                const selectedItem = Enumerable.from(flatComponents)
                    .where(n => n.node.selected)
                    .lastOrDefault();
                const focusedItem = Enumerable.from(flatComponents)
                    .where(n => n.node.focused)
                    .lastOrDefault();
                this.keyManager?.setActiveItem(focusedItem || selectedItem || flatComponents[0]);
            }
            this.cdr.detectChanges();
        });
    }
    ngOnChanges(changes) {
        if (changes && changes["data"] && !changes["data"].isFirstChange()) {
            this.prepareNodeList();
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        if (!this.keyField) {
            throw new Error("mona-tree-view: keyField is required. (keyField is a field that is unique for each node.)");
        }
        this.prepareNodeList();
        this.setEvents();
    }
    nodeTrackBy(index, item) {
        return item.key;
    }
    onNodeDragEnd(event) {
        const dragEvent = new NodeDragEndEvent(event.source.data.getLookupItem(), event.event);
        this.nodeDragEnd.emit(dragEvent);
        this.dragging = false;
        this.dragNode = undefined;
    }
    onNodeDragMove(event, node) {
        const dragEvent = new NodeDragEvent(node.getLookupItem(), this.dropTargetNode?.getLookupItem(), this.dropPosition, event.event);
        this.nodeDrag.emit(dragEvent);
        if (event.event) {
            const draggedElement = event.source.element.nativeElement.nextSibling;
            draggedElement.style.top = `${10}px`;
            draggedElement.style.left = `${10}px`;
        }
    }
    onNodeDragStart(event) {
        const dragEvent = new NodeDragStartEvent(event.source.data.getLookupItem(), event.event);
        this.nodeDragStart.emit(dragEvent);
        if (dragEvent.isDefaultPrevented()) {
            return;
        }
        this.dragging = true;
        this.dragNode = event.source.data;
    }
    onNodeDrop(event) {
        const dropEvent = new NodeDropEvent(event.item.data.getLookupItem(), this.dropTargetNode?.getLookupItem(), this.dropPosition, event.event);
        this.nodeDrop.emit(dropEvent);
        if (dropEvent.isDefaultPrevented()) {
            return;
        }
        if (!event.isPointerOverContainer || !this.dropTargetNode) {
            return;
        }
        const draggedNode = event.item.data;
        if (this.dropTargetNode.uid === draggedNode.uid || this.dropTargetNode.isDescendantOf(draggedNode)) {
            return;
        }
        if (this.dropPosition === "inside") {
            if (draggedNode.parent?.uid === this.dropTargetNode.uid) {
                return;
            }
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            else {
                this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
            }
            this.dropTargetNode.nodes = [...this.dropTargetNode.nodes, draggedNode];
            if (draggedNode.parent) {
                this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
            }
            draggedNode.parent = this.dropTargetNode;
            this.dropTargetNode.expanded = true;
            // if (this.dropTargetNode.nodes.length === 1 && this.dropTargetNode.nodes[0].uid === draggedNode.uid) {
            //     if (this.dropTargetNode.checked && !draggedNode.checked) {
            //         this.treeViewService.toggleNodeCheck(draggedNode, true);
            //     } else if (!this.dropTargetNode.checked && draggedNode.checked) {
            //         this.treeViewService.toggleNodeCheck(draggedNode, false);
            //     }
            // } else {
            //     this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
            // }
            this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
            this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
        }
        else if (this.dropPosition === "before") {
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            if (this.dropTargetNode.parent) {
                const index = this.dropTargetNode.parent.nodes.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.dropTargetNode.parent.nodes.splice(index, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = this.dropTargetNode.parent;
                }
                this.treeViewService.updateNodeCheckStatus(this.dropTargetNode.parent);
            }
            else {
                const index = this.treeViewService.nodeList.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
                    this.treeViewService.nodeList.splice(index, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = undefined;
                    this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
                }
            }
        }
        else if (this.dropPosition === "after") {
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            if (this.dropTargetNode.parent) {
                const index = this.dropTargetNode.parent.nodes.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.dropTargetNode.parent.nodes.splice(index + 1, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = this.dropTargetNode.parent;
                }
                this.treeViewService.updateNodeCheckStatus(this.dropTargetNode.parent);
            }
            else {
                const index = this.treeViewService.nodeList.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
                    this.treeViewService.nodeList.splice(index + 1, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = undefined;
                    this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
                }
            }
        }
        this.dragging = false;
    }
    onNodeDropPositionChange(event) {
        this.dropPosition = event.position;
        this.dropTargetNode = event.node;
    }
    onNodeSelect(node) {
        const components = this.flattenComponents();
        const component = components.find(component => component.node.uid === node.uid);
        if (component) {
            this.keyManager?.setActiveItem(component);
        }
    }
    prepareNodeList() {
        this.treeViewService.nodeList = [];
        this.treeViewService.viewNodeList = [];
        this.treeViewService.nodeDictionary.clear();
        this.prepareNodeListRecursively(this.data, undefined, this.treeViewService.nodeList);
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        this.updateDisabledState();
        this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
    }
    prepareNodeListRecursively(root, parentNode, childNodes) {
        const rootList = new List(root ?? []);
        if (rootList.length === 0) {
            return;
        }
        for (const dataItem of rootList) {
            const nodeId = dataItem[this.keyField];
            const node = new Node({
                key: nodeId,
                data: dataItem,
                checked: false,
                expanded: false,
                selected: false,
                text: dataItem[this.textField],
                nodes: [],
                parent: parentNode
            });
            if (this.childrenField) {
                this.prepareNodeListRecursively(dataItem[this.childrenField], node, node.nodes);
            }
            childNodes?.push(node);
            this.treeViewService.nodeDictionary.add(node.uid, node);
        }
    }
    setEvents() {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(filter(event => event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "Enter" ||
            event.key === " "), takeUntil(this.componentDestroy$))
            .subscribe(event => {
            event.preventDefault();
            switch (event.key) {
                case "ArrowDown":
                    this.keyManager?.onKeydown(event);
                    break;
                case "ArrowUp":
                    this.keyManager?.onKeydown(event);
                    break;
                case "ArrowLeft":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeExpand(this.keyManager.activeItem.node, false);
                    }
                    break;
                case "ArrowRight":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeExpand(this.keyManager.activeItem.node, true);
                    }
                    break;
                case "Enter":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeSelection(this.keyManager.activeItem.node);
                    }
                    break;
                case " ":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeCheck(this.keyManager.activeItem.node);
                    }
                    break;
            }
        });
        fromEvent(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
            this.treeViewService.nodeDictionary.values().forEach(n => (n.focused = false));
        });
    }
    updateDisabledState() {
        if (this.disabler) {
            const disabler = TreeViewService.getNodeDisablerAction(this.disabler);
            for (const node of this.treeViewService.nodeDictionary.values()) {
                node.disabled = disabler(node.data);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.TreeViewService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewComponent, selector: "mona-tree-view", inputs: { childrenField: "childrenField", data: "data", keyField: "keyField", nodeDisabler: "nodeDisabler", textField: "textField" }, outputs: { nodeClick: "nodeClick", nodeDoubleClick: "nodeDoubleClick", nodeDrag: "nodeDrag", nodeDragEnd: "nodeDragEnd", nodeDragStart: "nodeDragStart", nodeDrop: "nodeDrop" }, providers: [TreeViewService], queries: [{ propertyName: "nodeTextTemplate", first: true, predicate: TreeViewNodeTextTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "nodeComponents", predicate: TreeViewNodeComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-tree-view\" tabindex=\"0\">\n    <ul class=\"mona-tree-list\" cdkDropList [cdkDropListSortingDisabled]=\"true\"\n        (cdkDropListDropped)=\"onNodeDrop($event)\">\n        <ng-template #treeTemplate let-nodes>\n            <ng-container *ngFor=\"let node of nodes; let nx = index; trackBy:nodeTrackBy;\">\n                <li class=\"mona-tree-list-item\" cdkDrag [cdkDragData]=\"node\" (cdkDragStarted)=\"onNodeDragStart($event)\"\n                    (cdkDragEnded)=\"onNodeDragEnd($event)\" (cdkDragMoved)=\"onNodeDragMove($event, node)\">\n                    <mona-tree-view-node [node]=\"node\" [nodeTextTemplate]=\"nodeTextTemplate\" [dragging]=\"dragging\"\n                                         (dropPositionChange)=\"onNodeDropPositionChange($event)\"\n                                         (nodeSelect)=\"onNodeSelect($event)\"\n                                         (nodeClick)=\"nodeClick.emit($event)\"\n                                         (nodeDoubleClick)=\"nodeDoubleClick.emit($event)\"></mona-tree-view-node>\n                    <ul class=\"mona-subtree-list\" *ngIf=\"node.nodes.length !== 0 && node.expanded\">\n                        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: node.nodes}\"></ng-container>\n                    </ul>\n                    <ng-template cdkDragPreview [data]=\"node\">\n                        <div class=\"mona-tree-view-node-dragging\">\n                            <span>\n                                <ng-container *ngIf=\"dropPosition==='inside'\">\n                                    <fa-icon [icon]=\"dropInsideIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='after'\">\n                                    <fa-icon [icon]=\"dropAfterIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='before'\">\n                                    <fa-icon [icon]=\"dropBeforeIcon\"></fa-icon>\n                                </ng-container>\n                            </span>\n                            <span>{{node.text}}</span>\n                        </div>\n                    </ng-template>\n                </li>\n            </ng-container>\n        </ng-template>\n        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                      [ngTemplateOutletContext]=\"{$implicit: treeViewService.viewNodeList}\"></ng-container>\n    </ul>\n</div>\n", styles: ["div.mona-tree-view{outline:none}ul{list-style-type:none;overflow:hidden}ul.mona-tree-list{margin-top:10px;padding-bottom:2px}ul li{list-style-type:none;position:relative;color:var(--mona-text)}ul.mona-subtree-list{padding-left:19px}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i3.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: i4.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i4.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: i4.CdkDragPreview, selector: "ng-template[cdkDragPreview]", inputs: ["data", "matchSize"] }, { kind: "component", type: i5.TreeViewNodeComponent, selector: "mona-tree-view-node", inputs: ["dragging", "node", "nodeTextTemplate"], outputs: ["dropPositionChange", "nodeClick", "nodeDoubleClick", "nodeSelect"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tree-view", providers: [TreeViewService], template: "<div class=\"mona-tree-view\" tabindex=\"0\">\n    <ul class=\"mona-tree-list\" cdkDropList [cdkDropListSortingDisabled]=\"true\"\n        (cdkDropListDropped)=\"onNodeDrop($event)\">\n        <ng-template #treeTemplate let-nodes>\n            <ng-container *ngFor=\"let node of nodes; let nx = index; trackBy:nodeTrackBy;\">\n                <li class=\"mona-tree-list-item\" cdkDrag [cdkDragData]=\"node\" (cdkDragStarted)=\"onNodeDragStart($event)\"\n                    (cdkDragEnded)=\"onNodeDragEnd($event)\" (cdkDragMoved)=\"onNodeDragMove($event, node)\">\n                    <mona-tree-view-node [node]=\"node\" [nodeTextTemplate]=\"nodeTextTemplate\" [dragging]=\"dragging\"\n                                         (dropPositionChange)=\"onNodeDropPositionChange($event)\"\n                                         (nodeSelect)=\"onNodeSelect($event)\"\n                                         (nodeClick)=\"nodeClick.emit($event)\"\n                                         (nodeDoubleClick)=\"nodeDoubleClick.emit($event)\"></mona-tree-view-node>\n                    <ul class=\"mona-subtree-list\" *ngIf=\"node.nodes.length !== 0 && node.expanded\">\n                        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: node.nodes}\"></ng-container>\n                    </ul>\n                    <ng-template cdkDragPreview [data]=\"node\">\n                        <div class=\"mona-tree-view-node-dragging\">\n                            <span>\n                                <ng-container *ngIf=\"dropPosition==='inside'\">\n                                    <fa-icon [icon]=\"dropInsideIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='after'\">\n                                    <fa-icon [icon]=\"dropAfterIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='before'\">\n                                    <fa-icon [icon]=\"dropBeforeIcon\"></fa-icon>\n                                </ng-container>\n                            </span>\n                            <span>{{node.text}}</span>\n                        </div>\n                    </ng-template>\n                </li>\n            </ng-container>\n        </ng-template>\n        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                      [ngTemplateOutletContext]=\"{$implicit: treeViewService.viewNodeList}\"></ng-container>\n    </ul>\n</div>\n", styles: ["div.mona-tree-view{outline:none}ul{list-style-type:none;overflow:hidden}ul.mona-tree-list{margin-top:10px;padding-bottom:2px}ul li{list-style-type:none;position:relative;color:var(--mona-text)}ul.mona-subtree-list{padding-left:19px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.TreeViewService }]; }, propDecorators: { childrenField: [{
                type: Input
            }], data: [{
                type: Input
            }], keyField: [{
                type: Input
            }], nodeClick: [{
                type: Output
            }], nodeComponents: [{
                type: ViewChildren,
                args: [TreeViewNodeComponent]
            }], nodeDisabler: [{
                type: Input
            }], nodeDoubleClick: [{
                type: Output
            }], nodeDrag: [{
                type: Output
            }], nodeDragEnd: [{
                type: Output
            }], nodeDragStart: [{
                type: Output
            }], nodeDrop: [{
                type: Output
            }], nodeTextTemplate: [{
                type: ContentChild,
                args: [TreeViewNodeTextTemplateDirective, { read: TemplateRef }]
            }], textField: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi90cmVlLXZpZXcvY29tcG9uZW50cy90cmVlLXZpZXcvdHJlZS12aWV3LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi90cmVlLXZpZXcvY29tcG9uZW50cy90cmVlLXZpZXcvdHJlZS12aWV3LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFJSCxTQUFTLEVBQ1QsWUFBWSxFQUdaLFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxFQUNOLFNBQVMsRUFFVCxXQUFXLEVBQ1gsWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQUs1RyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQWtCLE1BQU0sbUNBQW1DLENBQUM7QUFDbkcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUvRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsMEJB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U0FBUztzQkFEZixNQUFNO2dCQUlBLGNBQWM7c0JBRHBCLFlBQVk7dUJBQUMscUJBQXFCO2dCQUl4QixZQUFZO3NCQUR0QixLQUFLO2dCQU9DLGVBQWU7c0JBRHJCLE1BQU07Z0JBSUEsUUFBUTtzQkFEZCxNQUFNO2dCQUlBLFdBQVc7c0JBRGpCLE1BQU07Z0JBSUEsYUFBYTtzQkFEbkIsTUFBTTtnQkFJQSxRQUFRO3NCQURkLE1BQU07Z0JBSUEsZ0JBQWdCO3NCQUR0QixZQUFZO3VCQUFDLGlDQUFpQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFJL0QsU0FBUztzQkFEZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0LFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZHJlblxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gXCIuLi8uLi9kYXRhL05vZGVcIjtcbmltcG9ydCB7IEVudW1lcmFibGUsIExpc3QgfSBmcm9tIFwiQG1pcmVpL3RzLWNvbGxlY3Rpb25zXCI7XG5pbXBvcnQgeyBUcmVlVmlld1NlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZXMvdHJlZS12aWV3LnNlcnZpY2VcIjtcbmltcG9ydCB7IFRyZWVWaWV3Tm9kZVRleHRUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL3RyZWUtdmlldy1ub2RlLXRleHQtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvQWN0aW9uXCI7XG5pbXBvcnQgeyBDZGtEcmFnRHJvcCwgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ01vdmUsIENka0RyYWdTdGFydCB9IGZyb20gXCJAYW5ndWxhci9jZGsvZHJhZy1kcm9wXCI7XG5pbXBvcnQgeyBEcm9wUG9zaXRpb24gfSBmcm9tIFwiLi4vLi4vZGF0YS9Ecm9wUG9zaXRpb25cIjtcbmltcG9ydCB7IERyb3BQb3NpdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4uLy4uL2RhdGEvRHJvcFBvc2l0aW9uQ2hhbmdlRXZlbnRcIjtcbmltcG9ydCB7IGZhQXJyb3dEb3duLCBmYUFycm93VXAsIGZhUGx1cywgSWNvbkRlZmluaXRpb24gfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zXCI7XG5pbXBvcnQgeyBOb2RlRHJhZ1N0YXJ0RXZlbnQgfSBmcm9tIFwiLi4vLi4vZGF0YS9Ob2RlRHJhZ1N0YXJ0RXZlbnRcIjtcbmltcG9ydCB7IE5vZGVEcmFnRXZlbnQgfSBmcm9tIFwiLi4vLi4vZGF0YS9Ob2RlRHJhZ0V2ZW50XCI7XG5pbXBvcnQgeyBOb2RlRHJvcEV2ZW50IH0gZnJvbSBcIi4uLy4uL2RhdGEvTm9kZURyb3BFdmVudFwiO1xuaW1wb3J0IHsgTm9kZURyYWdFbmRFdmVudCB9IGZyb20gXCIuLi8uLi9kYXRhL05vZGVEcmFnRW5kRXZlbnRcIjtcbmltcG9ydCB7IE5vZGVDbGlja0V2ZW50IH0gZnJvbSBcIi4uLy4uL2RhdGEvTm9kZUNsaWNrRXZlbnRcIjtcbmltcG9ydCB7IFRyZWVWaWV3Tm9kZUNvbXBvbmVudCB9IGZyb20gXCIuLi90cmVlLXZpZXctbm9kZS90cmVlLXZpZXctbm9kZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyLCBGb2N1c0tleU1hbmFnZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY2RrL2ExMXlcIjtcbmltcG9ydCB7IGZpbHRlciwgZnJvbUV2ZW50LCBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLXRyZWUtdmlld1wiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vdHJlZS12aWV3LmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL3RyZWUtdmlldy5jb21wb25lbnQuc2Nzc1wiXSxcbiAgICBwcm92aWRlcnM6IFtUcmVlVmlld1NlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIFRyZWVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnREZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSBkaXNhYmxlcj86IEFjdGlvbjxhbnksIGJvb2xlYW4+IHwgc3RyaW5nO1xuICAgIHByaXZhdGUgZHJhZ05vZGU/OiBOb2RlO1xuICAgIHByaXZhdGUgZHJvcFRhcmdldE5vZGU/OiBOb2RlO1xuICAgIHByaXZhdGUga2V5TWFuYWdlcj86IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPFRyZWVWaWV3Tm9kZUNvbXBvbmVudD47XG4gICAgcHVibGljIHJlYWRvbmx5IGRyb3BBZnRlckljb246IEljb25EZWZpbml0aW9uID0gZmFBcnJvd0Rvd247XG4gICAgcHVibGljIHJlYWRvbmx5IGRyb3BCZWZvcmVJY29uOiBJY29uRGVmaW5pdGlvbiA9IGZhQXJyb3dVcDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZHJvcEluc2lkZUljb246IEljb25EZWZpbml0aW9uID0gZmFQbHVzO1xuICAgIHB1YmxpYyBkcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBkcm9wUG9zaXRpb24/OiBEcm9wUG9zaXRpb247XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjaGlsZHJlbkZpZWxkOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGF0YTogSXRlcmFibGU8YW55PiA9IFtdO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMga2V5RmllbGQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbm9kZUNsaWNrOiBFdmVudEVtaXR0ZXI8Tm9kZUNsaWNrRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOb2RlQ2xpY2tFdmVudD4oKTtcblxuICAgIEBWaWV3Q2hpbGRyZW4oVHJlZVZpZXdOb2RlQ29tcG9uZW50KVxuICAgIHB1YmxpYyBub2RlQ29tcG9uZW50czogUXVlcnlMaXN0PFRyZWVWaWV3Tm9kZUNvbXBvbmVudD4gPSBuZXcgUXVlcnlMaXN0PFRyZWVWaWV3Tm9kZUNvbXBvbmVudD4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBub2RlRGlzYWJsZXIobm9kZURpc2FibGVyOiBBY3Rpb248YW55LCBib29sZWFuPiB8IHN0cmluZykge1xuICAgICAgICB0aGlzLmRpc2FibGVyID0gbm9kZURpc2FibGVyO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbm9kZURvdWJsZUNsaWNrOiBFdmVudEVtaXR0ZXI8Tm9kZUNsaWNrRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOb2RlQ2xpY2tFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBub2RlRHJhZzogRXZlbnRFbWl0dGVyPE5vZGVEcmFnRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOb2RlRHJhZ0V2ZW50PigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG5vZGVEcmFnRW5kOiBFdmVudEVtaXR0ZXI8Tm9kZURyYWdFbmRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5vZGVEcmFnRW5kRXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbm9kZURyYWdTdGFydDogRXZlbnRFbWl0dGVyPE5vZGVEcmFnU3RhcnRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5vZGVEcmFnU3RhcnRFdmVudD4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBub2RlRHJvcDogRXZlbnRFbWl0dGVyPE5vZGVEcm9wRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOb2RlRHJvcEV2ZW50PigpO1xuXG4gICAgQENvbnRlbnRDaGlsZChUcmVlVmlld05vZGVUZXh0VGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgbm9kZVRleHRUZW1wbGF0ZT86IFRlbXBsYXRlUmVmPG5ldmVyPiB8IG51bGwgPSBudWxsO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdGV4dEZpZWxkOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0cmVlVmlld1NlcnZpY2U6IFRyZWVWaWV3U2VydmljZVxuICAgICkge31cblxuICAgIHByaXZhdGUgZmxhdHRlbkNvbXBvbmVudHMoKTogVHJlZVZpZXdOb2RlQ29tcG9uZW50W10ge1xuICAgICAgICBjb25zdCBmbGF0dGVuID0gKGl0ZW1zOiBOb2RlW10pOiBOb2RlW10gPT4ge1xuICAgICAgICAgICAgY29uc3QgZmxhdDogTm9kZVtdID0gW107XG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGZsYXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5ub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYXQucHVzaCguLi5mbGF0dGVuKGl0ZW0ubm9kZXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmbGF0O1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBmbGF0Tm9kZXMgPSBmbGF0dGVuKHRoaXMudHJlZVZpZXdTZXJ2aWNlLnZpZXdOb2RlTGlzdCk7XG4gICAgICAgIGNvbnN0IGZsYXRDb21wb25lbnRzOiBUcmVlVmlld05vZGVDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICBmbGF0Tm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMubm9kZUNvbXBvbmVudHMuZmluZChjID0+IGMubm9kZS51aWQgPT09IG5vZGUudWlkKTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBmbGF0Q29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmxhdENvbXBvbmVudHM7XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZmxhdENvbXBvbmVudHMgPSB0aGlzLmZsYXR0ZW5Db21wb25lbnRzKCk7XG4gICAgICAgIHRoaXMua2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcihmbGF0Q29tcG9uZW50cykuc2tpcFByZWRpY2F0ZShcbiAgICAgICAgICAgIG4gPT4gbi5ub2RlLmRpc2FibGVkIHx8IG4ubm9kZS5hbnlQYXJlbnRDb2xsYXBzZWQoKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm5vZGVDb21wb25lbnRzLmNoYW5nZXMuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsYXN0QWN0aXZlSXRlbSA9IHRoaXMua2V5TWFuYWdlcj8uYWN0aXZlSXRlbTtcbiAgICAgICAgICAgIHRoaXMua2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcihmbGF0Q29tcG9uZW50cykuc2tpcFByZWRpY2F0ZShcbiAgICAgICAgICAgICAgICBuID0+IG4ubm9kZS5kaXNhYmxlZCB8fCBuLm5vZGUuYW55UGFyZW50Q29sbGFwc2VkKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAobGFzdEFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleU1hbmFnZXI/LnNldEFjdGl2ZUl0ZW0obGFzdEFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBFbnVtZXJhYmxlLmZyb20oZmxhdENvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZShuID0+IG4ubm9kZS5zZWxlY3RlZClcbiAgICAgICAgICAgICAgICAgICAgLmxhc3RPckRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb2N1c2VkSXRlbSA9IEVudW1lcmFibGUuZnJvbShmbGF0Q29tcG9uZW50cylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKG4gPT4gbi5ub2RlLmZvY3VzZWQpXG4gICAgICAgICAgICAgICAgICAgIC5sYXN0T3JEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlNYW5hZ2VyPy5zZXRBY3RpdmVJdGVtKGZvY3VzZWRJdGVtIHx8IHNlbGVjdGVkSXRlbSB8fCBmbGF0Q29tcG9uZW50c1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzICYmIGNoYW5nZXNbXCJkYXRhXCJdICYmICFjaGFuZ2VzW1wiZGF0YVwiXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZU5vZGVMaXN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMua2V5RmllbGQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBcIm1vbmEtdHJlZS12aWV3OiBrZXlGaWVsZCBpcyByZXF1aXJlZC4gKGtleUZpZWxkIGlzIGEgZmllbGQgdGhhdCBpcyB1bmlxdWUgZm9yIGVhY2ggbm9kZS4pXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmVwYXJlTm9kZUxpc3QoKTtcbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbm9kZVRyYWNrQnkoaW5kZXg6IG51bWJlciwgaXRlbTogTm9kZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBpdGVtLmtleTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Ob2RlRHJhZ0VuZChldmVudDogQ2RrRHJhZ0VuZDxOb2RlPik6IHZvaWQge1xuICAgICAgICBjb25zdCBkcmFnRXZlbnQgPSBuZXcgTm9kZURyYWdFbmRFdmVudChldmVudC5zb3VyY2UuZGF0YS5nZXRMb29rdXBJdGVtKCksIGV2ZW50LmV2ZW50KTtcbiAgICAgICAgdGhpcy5ub2RlRHJhZ0VuZC5lbWl0KGRyYWdFdmVudCk7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmFnTm9kZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Ob2RlRHJhZ01vdmUoZXZlbnQ6IENka0RyYWdNb3ZlLCBub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRyYWdFdmVudCA9IG5ldyBOb2RlRHJhZ0V2ZW50KFxuICAgICAgICAgICAgbm9kZS5nZXRMb29rdXBJdGVtKCksXG4gICAgICAgICAgICB0aGlzLmRyb3BUYXJnZXROb2RlPy5nZXRMb29rdXBJdGVtKCksXG4gICAgICAgICAgICB0aGlzLmRyb3BQb3NpdGlvbixcbiAgICAgICAgICAgIGV2ZW50LmV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubm9kZURyYWcuZW1pdChkcmFnRXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQuZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGRyYWdnZWRFbGVtZW50ID0gZXZlbnQuc291cmNlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5uZXh0U2libGluZyBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGRyYWdnZWRFbGVtZW50LnN0eWxlLnRvcCA9IGAkezEwfXB4YDtcbiAgICAgICAgICAgIGRyYWdnZWRFbGVtZW50LnN0eWxlLmxlZnQgPSBgJHsxMH1weGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25Ob2RlRHJhZ1N0YXJ0KGV2ZW50OiBDZGtEcmFnU3RhcnQ8Tm9kZT4pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZHJhZ0V2ZW50ID0gbmV3IE5vZGVEcmFnU3RhcnRFdmVudChldmVudC5zb3VyY2UuZGF0YS5nZXRMb29rdXBJdGVtKCksIGV2ZW50LmV2ZW50KTtcbiAgICAgICAgdGhpcy5ub2RlRHJhZ1N0YXJ0LmVtaXQoZHJhZ0V2ZW50KTtcbiAgICAgICAgaWYgKGRyYWdFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmRyYWdOb2RlID0gZXZlbnQuc291cmNlLmRhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTm9kZURyb3AoZXZlbnQ6IENka0RyYWdEcm9wPE5vZGUsIE5vZGUsIE5vZGU+KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRyb3BFdmVudCA9IG5ldyBOb2RlRHJvcEV2ZW50KFxuICAgICAgICAgICAgZXZlbnQuaXRlbS5kYXRhLmdldExvb2t1cEl0ZW0oKSxcbiAgICAgICAgICAgIHRoaXMuZHJvcFRhcmdldE5vZGU/LmdldExvb2t1cEl0ZW0oKSxcbiAgICAgICAgICAgIHRoaXMuZHJvcFBvc2l0aW9uLFxuICAgICAgICAgICAgZXZlbnQuZXZlbnRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5ub2RlRHJvcC5lbWl0KGRyb3BFdmVudCk7XG4gICAgICAgIGlmIChkcm9wRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWV2ZW50LmlzUG9pbnRlck92ZXJDb250YWluZXIgfHwgIXRoaXMuZHJvcFRhcmdldE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkcmFnZ2VkTm9kZSA9IGV2ZW50Lml0ZW0uZGF0YTtcbiAgICAgICAgaWYgKHRoaXMuZHJvcFRhcmdldE5vZGUudWlkID09PSBkcmFnZ2VkTm9kZS51aWQgfHwgdGhpcy5kcm9wVGFyZ2V0Tm9kZS5pc0Rlc2NlbmRhbnRPZihkcmFnZ2VkTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcm9wUG9zaXRpb24gPT09IFwiaW5zaWRlXCIpIHtcbiAgICAgICAgICAgIGlmIChkcmFnZ2VkTm9kZS5wYXJlbnQ/LnVpZCA9PT0gdGhpcy5kcm9wVGFyZ2V0Tm9kZS51aWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHJhZ2dlZE5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgZHJhZ2dlZE5vZGUucGFyZW50Lm5vZGVzID0gZHJhZ2dlZE5vZGUucGFyZW50Lm5vZGVzLmZpbHRlcihub2RlID0+IG5vZGUudWlkICE9PSBkcmFnZ2VkTm9kZS51aWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS5ub2RlTGlzdCA9IHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVMaXN0LmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9PiBub2RlLnVpZCAhPT0gZHJhZ2dlZE5vZGUudWlkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZHJvcFRhcmdldE5vZGUubm9kZXMgPSBbLi4udGhpcy5kcm9wVGFyZ2V0Tm9kZS5ub2RlcywgZHJhZ2dlZE5vZGVdO1xuICAgICAgICAgICAgaWYgKGRyYWdnZWROb2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnVwZGF0ZU5vZGVDaGVja1N0YXR1cyhkcmFnZ2VkTm9kZS5wYXJlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZHJhZ2dlZE5vZGUucGFyZW50ID0gdGhpcy5kcm9wVGFyZ2V0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZHJvcFRhcmdldE5vZGUuZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZHJvcFRhcmdldE5vZGUubm9kZXMubGVuZ3RoID09PSAxICYmIHRoaXMuZHJvcFRhcmdldE5vZGUubm9kZXNbMF0udWlkID09PSBkcmFnZ2VkTm9kZS51aWQpIHtcbiAgICAgICAgICAgIC8vICAgICBpZiAodGhpcy5kcm9wVGFyZ2V0Tm9kZS5jaGVja2VkICYmICFkcmFnZ2VkTm9kZS5jaGVja2VkKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnRvZ2dsZU5vZGVDaGVjayhkcmFnZ2VkTm9kZSwgdHJ1ZSk7XG4gICAgICAgICAgICAvLyAgICAgfSBlbHNlIGlmICghdGhpcy5kcm9wVGFyZ2V0Tm9kZS5jaGVja2VkICYmIGRyYWdnZWROb2RlLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UudG9nZ2xlTm9kZUNoZWNrKGRyYWdnZWROb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS51cGRhdGVOb2RlQ2hlY2tTdGF0dXMoZHJhZ2dlZE5vZGUucGFyZW50KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnVwZGF0ZU5vZGVDaGVja1N0YXR1cyhkcmFnZ2VkTm9kZS5wYXJlbnQpO1xuICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uudmlld05vZGVMaXN0ID0gWy4uLnRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVMaXN0XTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyb3BQb3NpdGlvbiA9PT0gXCJiZWZvcmVcIikge1xuICAgICAgICAgICAgaWYgKGRyYWdnZWROb2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGRyYWdnZWROb2RlLnBhcmVudC5ub2RlcyA9IGRyYWdnZWROb2RlLnBhcmVudC5ub2Rlcy5maWx0ZXIobm9kZSA9PiBub2RlLnVpZCAhPT0gZHJhZ2dlZE5vZGUudWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmRyb3BUYXJnZXROb2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kcm9wVGFyZ2V0Tm9kZS5wYXJlbnQubm9kZXMuZmluZEluZGV4KG5vZGUgPT4gbm9kZS51aWQgPT09IHRoaXMuZHJvcFRhcmdldE5vZGU/LnVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wVGFyZ2V0Tm9kZS5wYXJlbnQubm9kZXMuc3BsaWNlKGluZGV4LCAwLCBkcmFnZ2VkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkcmFnZ2VkTm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnVwZGF0ZU5vZGVDaGVja1N0YXR1cyhkcmFnZ2VkTm9kZS5wYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRyYWdnZWROb2RlLnBhcmVudCA9IHRoaXMuZHJvcFRhcmdldE5vZGUucGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS51cGRhdGVOb2RlQ2hlY2tTdGF0dXModGhpcy5kcm9wVGFyZ2V0Tm9kZS5wYXJlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVMaXN0LmZpbmRJbmRleChub2RlID0+IG5vZGUudWlkID09PSB0aGlzLmRyb3BUYXJnZXROb2RlPy51aWQpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVMaXN0ID0gdGhpcy50cmVlVmlld1NlcnZpY2Uubm9kZUxpc3QuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9PiBub2RlLnVpZCAhPT0gZHJhZ2dlZE5vZGUudWlkXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVMaXN0LnNwbGljZShpbmRleCwgMCwgZHJhZ2dlZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ2dlZE5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS51cGRhdGVOb2RlQ2hlY2tTdGF0dXMoZHJhZ2dlZE5vZGUucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2VkTm9kZS5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnZpZXdOb2RlTGlzdCA9IFsuLi50aGlzLnRyZWVWaWV3U2VydmljZS5ub2RlTGlzdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZHJvcFBvc2l0aW9uID09PSBcImFmdGVyXCIpIHtcbiAgICAgICAgICAgIGlmIChkcmFnZ2VkTm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBkcmFnZ2VkTm9kZS5wYXJlbnQubm9kZXMgPSBkcmFnZ2VkTm9kZS5wYXJlbnQubm9kZXMuZmlsdGVyKG5vZGUgPT4gbm9kZS51aWQgIT09IGRyYWdnZWROb2RlLnVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kcm9wVGFyZ2V0Tm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZHJvcFRhcmdldE5vZGUucGFyZW50Lm5vZGVzLmZpbmRJbmRleChub2RlID0+IG5vZGUudWlkID09PSB0aGlzLmRyb3BUYXJnZXROb2RlPy51aWQpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcFRhcmdldE5vZGUucGFyZW50Lm5vZGVzLnNwbGljZShpbmRleCArIDEsIDAsIGRyYWdnZWROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRyYWdnZWROb2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UudXBkYXRlTm9kZUNoZWNrU3RhdHVzKGRyYWdnZWROb2RlLnBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dlZE5vZGUucGFyZW50ID0gdGhpcy5kcm9wVGFyZ2V0Tm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnVwZGF0ZU5vZGVDaGVja1N0YXR1cyh0aGlzLmRyb3BUYXJnZXROb2RlLnBhcmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy50cmVlVmlld1NlcnZpY2Uubm9kZUxpc3QuZmluZEluZGV4KG5vZGUgPT4gbm9kZS51aWQgPT09IHRoaXMuZHJvcFRhcmdldE5vZGU/LnVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uubm9kZUxpc3QgPSB0aGlzLnRyZWVWaWV3U2VydmljZS5ub2RlTGlzdC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0+IG5vZGUudWlkICE9PSBkcmFnZ2VkTm9kZS51aWRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uubm9kZUxpc3Quc3BsaWNlKGluZGV4ICsgMSwgMCwgZHJhZ2dlZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ2dlZE5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS51cGRhdGVOb2RlQ2hlY2tTdGF0dXMoZHJhZ2dlZE5vZGUucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2VkTm9kZS5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnZpZXdOb2RlTGlzdCA9IFsuLi50aGlzLnRyZWVWaWV3U2VydmljZS5ub2RlTGlzdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Ob2RlRHJvcFBvc2l0aW9uQ2hhbmdlKGV2ZW50OiBEcm9wUG9zaXRpb25DaGFuZ2VFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRyb3BQb3NpdGlvbiA9IGV2ZW50LnBvc2l0aW9uO1xuICAgICAgICB0aGlzLmRyb3BUYXJnZXROb2RlID0gZXZlbnQubm9kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Ob2RlU2VsZWN0KG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IHRoaXMuZmxhdHRlbkNvbXBvbmVudHMoKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGNvbXBvbmVudCA9PiBjb21wb25lbnQubm9kZS51aWQgPT09IG5vZGUudWlkKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5rZXlNYW5hZ2VyPy5zZXRBY3RpdmVJdGVtKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXBhcmVOb2RlTGlzdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uubm9kZUxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uudmlld05vZGVMaXN0ID0gW107XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVEaWN0aW9uYXJ5LmNsZWFyKCk7XG4gICAgICAgIHRoaXMucHJlcGFyZU5vZGVMaXN0UmVjdXJzaXZlbHkodGhpcy5kYXRhLCB1bmRlZmluZWQsIHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVMaXN0KTtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UubG9hZENoZWNrZWRLZXlzKHRoaXMudHJlZVZpZXdTZXJ2aWNlLmNoZWNrZWRLZXlzKTtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UubG9hZEV4cGFuZGVkS2V5cyh0aGlzLnRyZWVWaWV3U2VydmljZS5leHBhbmRlZEtleXMpO1xuICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS5sb2FkU2VsZWN0ZWRLZXlzKHRoaXMudHJlZVZpZXdTZXJ2aWNlLnNlbGVjdGVkS2V5cyk7XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLmxvYWREaXNhYmxlZEtleXModGhpcy50cmVlVmlld1NlcnZpY2UuZGlzYWJsZWRLZXlzKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnZpZXdOb2RlTGlzdCA9IFsuLi50aGlzLnRyZWVWaWV3U2VydmljZS5ub2RlTGlzdF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVwYXJlTm9kZUxpc3RSZWN1cnNpdmVseShyb290OiBJdGVyYWJsZTxhbnk+LCBwYXJlbnROb2RlPzogTm9kZSwgY2hpbGROb2Rlcz86IGFueVtdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJvb3RMaXN0ID0gbmV3IExpc3Qocm9vdCA/PyBbXSk7XG4gICAgICAgIGlmIChyb290TGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGRhdGFJdGVtIG9mIHJvb3RMaXN0KSB7XG4gICAgICAgICAgICBjb25zdCBub2RlSWQgPSBkYXRhSXRlbVt0aGlzLmtleUZpZWxkXTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IE5vZGUgPSBuZXcgTm9kZTxhbnk+KHtcbiAgICAgICAgICAgICAgICBrZXk6IG5vZGVJZCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhSXRlbSxcbiAgICAgICAgICAgICAgICBjaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRleHQ6IGRhdGFJdGVtW3RoaXMudGV4dEZpZWxkXSxcbiAgICAgICAgICAgICAgICBub2RlczogW10sXG4gICAgICAgICAgICAgICAgcGFyZW50OiBwYXJlbnROb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuRmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVOb2RlTGlzdFJlY3Vyc2l2ZWx5KGRhdGFJdGVtW3RoaXMuY2hpbGRyZW5GaWVsZF0sIG5vZGUsIG5vZGUubm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGROb2Rlcz8ucHVzaChub2RlKTtcbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVEaWN0aW9uYXJ5LmFkZChub2RlLnVpZCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEV2ZW50cygpOiB2b2lkIHtcbiAgICAgICAgZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBcImtleWRvd25cIilcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmtleSA9PT0gXCJBcnJvd0Rvd25cIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQua2V5ID09PSBcIkFycm93VXBcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQua2V5ID09PSBcIkFycm93TGVmdFwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5rZXkgPT09IFwiQXJyb3dSaWdodFwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5rZXkgPT09IFwiRW50ZXJcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQua2V5ID09PSBcIiBcIlxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5TWFuYWdlcj8ub25LZXlkb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlNYW5hZ2VyPy5vbktleWRvd24oZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBcnJvd0xlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleU1hbmFnZXI/LmFjdGl2ZUl0ZW0/Lm5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS50b2dnbGVOb2RlRXhwYW5kKHRoaXMua2V5TWFuYWdlci5hY3RpdmVJdGVtLm5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dSaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5TWFuYWdlcj8uYWN0aXZlSXRlbT8ubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnRvZ2dsZU5vZGVFeHBhbmQodGhpcy5rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0ubm9kZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkVudGVyXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5rZXlNYW5hZ2VyPy5hY3RpdmVJdGVtPy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UudG9nZ2xlTm9kZVNlbGVjdGlvbih0aGlzLmtleU1hbmFnZXIuYWN0aXZlSXRlbS5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiIFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5TWFuYWdlcj8uYWN0aXZlSXRlbT8ubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnRvZ2dsZU5vZGVDaGVjayh0aGlzLmtleU1hbmFnZXIuYWN0aXZlSXRlbS5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwiZm9jdXNvdXRcIilcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLm5vZGVEaWN0aW9uYXJ5LnZhbHVlcygpLmZvckVhY2gobiA9PiAobi5mb2N1c2VkID0gZmFsc2UpKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGlzYWJsZWRTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpc2FibGVyID0gVHJlZVZpZXdTZXJ2aWNlLmdldE5vZGVEaXNhYmxlckFjdGlvbih0aGlzLmRpc2FibGVyKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLnRyZWVWaWV3U2VydmljZS5ub2RlRGljdGlvbmFyeS52YWx1ZXMoKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuZGlzYWJsZWQgPSBkaXNhYmxlcihub2RlLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1vbmEtdHJlZS12aWV3XCIgdGFiaW5kZXg9XCIwXCI+XG4gICAgPHVsIGNsYXNzPVwibW9uYS10cmVlLWxpc3RcIiBjZGtEcm9wTGlzdCBbY2RrRHJvcExpc3RTb3J0aW5nRGlzYWJsZWRdPVwidHJ1ZVwiXG4gICAgICAgIChjZGtEcm9wTGlzdERyb3BwZWQpPVwib25Ob2RlRHJvcCgkZXZlbnQpXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjdHJlZVRlbXBsYXRlIGxldC1ub2Rlcz5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygbm9kZXM7IGxldCBueCA9IGluZGV4OyB0cmFja0J5Om5vZGVUcmFja0J5O1wiPlxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cIm1vbmEtdHJlZS1saXN0LWl0ZW1cIiBjZGtEcmFnIFtjZGtEcmFnRGF0YV09XCJub2RlXCIgKGNka0RyYWdTdGFydGVkKT1cIm9uTm9kZURyYWdTdGFydCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgKGNka0RyYWdFbmRlZCk9XCJvbk5vZGVEcmFnRW5kKCRldmVudClcIiAoY2RrRHJhZ01vdmVkKT1cIm9uTm9kZURyYWdNb3ZlKCRldmVudCwgbm9kZSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPG1vbmEtdHJlZS12aWV3LW5vZGUgW25vZGVdPVwibm9kZVwiIFtub2RlVGV4dFRlbXBsYXRlXT1cIm5vZGVUZXh0VGVtcGxhdGVcIiBbZHJhZ2dpbmddPVwiZHJhZ2dpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZHJvcFBvc2l0aW9uQ2hhbmdlKT1cIm9uTm9kZURyb3BQb3NpdGlvbkNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vZGVTZWxlY3QpPVwib25Ob2RlU2VsZWN0KCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm9kZUNsaWNrKT1cIm5vZGVDbGljay5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm9kZURvdWJsZUNsaWNrKT1cIm5vZGVEb3VibGVDbGljay5lbWl0KCRldmVudClcIj48L21vbmEtdHJlZS12aWV3LW5vZGU+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm1vbmEtc3VidHJlZS1saXN0XCIgKm5nSWY9XCJub2RlLm5vZGVzLmxlbmd0aCAhPT0gMCAmJiBub2RlLmV4cGFuZGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRyZWVUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2RlLm5vZGVzfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgY2RrRHJhZ1ByZXZpZXcgW2RhdGFdPVwibm9kZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vbmEtdHJlZS12aWV3LW5vZGUtZHJhZ2dpbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImRyb3BQb3NpdGlvbj09PSdpbnNpZGUnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZmEtaWNvbiBbaWNvbl09XCJkcm9wSW5zaWRlSWNvblwiPjwvZmEtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJkcm9wUG9zaXRpb249PT0nYWZ0ZXInXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZmEtaWNvbiBbaWNvbl09XCJkcm9wQWZ0ZXJJY29uXCI+PC9mYS1pY29uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImRyb3BQb3NpdGlvbj09PSdiZWZvcmUnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZmEtaWNvbiBbaWNvbl09XCJkcm9wQmVmb3JlSWNvblwiPjwvZmEtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7bm9kZS50ZXh0fX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwidHJlZVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogdHJlZVZpZXdTZXJ2aWNlLnZpZXdOb2RlTGlzdH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L3VsPlxuPC9kaXY+XG4iXX0=