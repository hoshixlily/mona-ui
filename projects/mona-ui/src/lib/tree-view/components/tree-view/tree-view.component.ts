import { animate, style, transition, trigger } from "@angular/animations";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragEnd,
    CdkDragMove,
    CdkDragPreview,
    CdkDragStart,
    CdkDropList
} from "@angular/cdk/drag-drop";
import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChildren
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowDown, faArrowUp, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Enumerable, List } from "@mirei/ts-collections";
import { filter, fromEvent } from "rxjs";
import { Action } from "../../../utils/Action";
import { TreeViewNodeTextTemplateDirective } from "../../directives/tree-view-node-text-template.directive";
import { DropPosition } from "../../models/DropPosition";
import { DropPositionChangeEvent } from "../../models/DropPositionChangeEvent";
import { Node } from "../../models/Node";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { NodeDragEndEvent } from "../../models/NodeDragEndEvent";
import { NodeDragEvent } from "../../models/NodeDragEvent";
import { NodeDragStartEvent } from "../../models/NodeDragStartEvent";
import { NodeDropEvent } from "../../models/NodeDropEvent";
import { TreeViewService } from "../../services/tree-view.service";
import { TreeViewNodeComponent } from "../tree-view-node/tree-view-node.component";

@Component({
    selector: "mona-tree-view",
    templateUrl: "./tree-view.component.html",
    styleUrls: ["./tree-view.component.scss"],
    providers: [TreeViewService],
    animations: [
        trigger("nodeExpand", [
            transition(":enter", [
                style({ height: "0px", opacity: 0 }),
                animate("0.15s ease-out", style({ height: "*", opacity: 1 }))
            ]),
            transition(":leave", [animate("0.15s ease-out", style({ height: "0px", opacity: 0 }))])
        ])
    ],
    standalone: true,
    imports: [
        CdkDropList,
        NgFor,
        CdkDrag,
        TreeViewNodeComponent,
        NgIf,
        NgTemplateOutlet,
        CdkDragPreview,
        FontAwesomeModule
    ]
})
export class TreeViewComponent implements OnInit, OnChanges, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private disabler?: Action<any, boolean> | string;
    private dragNode?: Node;
    private dropTargetNode?: Node;
    private keyManager?: ActiveDescendantKeyManager<TreeViewNodeComponent>;
    public readonly dropAfterIcon: IconDefinition = faArrowDown;
    public readonly dropBeforeIcon: IconDefinition = faArrowUp;
    public readonly dropInsideIcon: IconDefinition = faPlus;
    public dragging: boolean = false;
    public dropPosition?: DropPosition;

    @Input()
    public childrenField: string = "";

    @Input()
    public data: Iterable<any> = [];

    @Input({ required: true })
    public keyField: string = "";

    @Output()
    public nodeClick: EventEmitter<NodeClickEvent> = new EventEmitter<NodeClickEvent>();

    @ViewChildren(TreeViewNodeComponent)
    public nodeComponents: QueryList<TreeViewNodeComponent> = new QueryList<TreeViewNodeComponent>();

    @Input()
    public set nodeDisabler(nodeDisabler: Action<any, boolean> | string) {
        this.disabler = nodeDisabler;
        this.updateDisabledState();
    }

    @Output()
    public nodeDoubleClick: EventEmitter<NodeClickEvent> = new EventEmitter<NodeClickEvent>();

    @Output()
    public nodeDrag: EventEmitter<NodeDragEvent> = new EventEmitter<NodeDragEvent>();

    @Output()
    public nodeDragEnd: EventEmitter<NodeDragEndEvent> = new EventEmitter<NodeDragEndEvent>();

    @Output()
    public nodeDragStart: EventEmitter<NodeDragStartEvent> = new EventEmitter<NodeDragStartEvent>();

    @Output()
    public nodeDrop: EventEmitter<NodeDropEvent> = new EventEmitter<NodeDropEvent>();

    @ContentChild(TreeViewNodeTextTemplateDirective, { read: TemplateRef })
    public nodeTextTemplate?: TemplateRef<never> | null = null;

    @Input()
    public textField: string = "";

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        public readonly treeViewService: TreeViewService
    ) {}

    private flattenComponents(): TreeViewNodeComponent[] {
        const flatNodes = TreeViewService.flattenNodes(this.treeViewService.viewNodeList);
        const flatComponents: TreeViewNodeComponent[] = [];
        flatNodes.forEach(node => {
            const component = this.nodeComponents.find(c => c.node.uid === node.uid);
            if (component) {
                flatComponents.push(component);
            }
        });
        return Enumerable.from(flatComponents)
            .orderBy(c => c.node.index)
            .toArray();
    }

    public ngAfterViewInit(): void {
        let flatComponents = this.flattenComponents();
        this.keyManager = new ActiveDescendantKeyManager(flatComponents).skipPredicate(
            n => n.node.disabled || n.node.anyParentCollapsed()
        );
        this.nodeComponents.changes.subscribe(result => {
            flatComponents = this.flattenComponents();
            const lastActiveItem = this.keyManager?.activeItem;
            this.keyManager = new ActiveDescendantKeyManager(flatComponents).skipPredicate(
                n => n.node.disabled || n.node.anyParentCollapsed()
            );
            if (lastActiveItem) {
                this.keyManager?.setActiveItem(lastActiveItem);
            } else {
                const selectedItem = Enumerable.from(flatComponents)
                    .where(n => n.node.selected)
                    .lastOrDefault();
                const focusedItem = Enumerable.from(flatComponents)
                    .where(n => n.node.focused())
                    .lastOrDefault();
                this.keyManager?.setActiveItem(focusedItem || selectedItem || flatComponents[0]);
            }
            this.cdr.detectChanges();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["data"] && !changes["data"].isFirstChange()) {
            this.prepareNodeList();
        }
    }

    public ngOnInit(): void {
        if (!this.keyField) {
            throw new Error(
                "mona-tree-view: keyField is required. (keyField is a field that is unique for each node.)"
            );
        }
        this.prepareNodeList();
        this.setEvents();
    }

    public nodeTrackBy(index: number, item: Node): string {
        return item.key;
    }

    public onNodeDragEnd(event: CdkDragEnd<Node>): void {
        const dragEvent = new NodeDragEndEvent(event.source.data.getLookupItem(), event.event);
        this.nodeDragEnd.emit(dragEvent);
        this.dragging = false;
        this.dragNode = undefined;
    }

    public onNodeDragMove(event: CdkDragMove, node: Node): void {
        const dragEvent = new NodeDragEvent(
            node.getLookupItem(),
            this.dropTargetNode?.getLookupItem(),
            this.dropPosition,
            event.event
        );
        this.nodeDrag.emit(dragEvent);
        if (event.event) {
            const draggedElement = event.source.element.nativeElement.nextSibling as HTMLElement;
            draggedElement.style.top = `${10}px`;
            draggedElement.style.left = `${10}px`;
        }
    }

    public onNodeDragStart(event: CdkDragStart<Node>): void {
        const dragEvent = new NodeDragStartEvent(event.source.data.getLookupItem(), event.event);
        this.nodeDragStart.emit(dragEvent);
        if (dragEvent.isDefaultPrevented()) {
            return;
        }
        this.dragging = true;
        this.dragNode = event.source.data;
    }

    public onNodeDrop(event: CdkDragDrop<Node, Node, Node>): void {
        const dropEvent = new NodeDropEvent(
            event.item.data.getLookupItem(),
            this.dropTargetNode?.getLookupItem(),
            this.dropPosition,
            event.event
        );
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
            } else {
                this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                    node => node.uid !== draggedNode.uid
                );
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
        } else if (this.dropPosition === "before") {
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            if (this.dropTargetNode.parent) {
                const index = this.dropTargetNode.parent.nodes.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.dropTargetNode.parent.nodes.splice(index, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    } else {
                        this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                            node => node.uid !== draggedNode.uid
                        );
                    }
                    draggedNode.parent = this.dropTargetNode.parent;
                }
                this.treeViewService.updateNodeCheckStatus(this.dropTargetNode.parent);
            } else {
                const index = this.treeViewService.nodeList.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                        node => node.uid !== draggedNode.uid
                    );
                    this.treeViewService.nodeList.splice(index, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    } else {
                        this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                            node => node.uid !== draggedNode.uid
                        );
                    }
                    draggedNode.parent = undefined;
                }
            }
        } else if (this.dropPosition === "after") {
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            if (this.dropTargetNode.parent) {
                const index = this.dropTargetNode.parent.nodes.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.dropTargetNode.parent.nodes.splice(index + 1, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    } else {
                        this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                            node => node.uid !== draggedNode.uid
                        );
                    }
                    draggedNode.parent = this.dropTargetNode.parent;
                }
                this.treeViewService.updateNodeCheckStatus(this.dropTargetNode.parent);
            } else {
                const index = this.treeViewService.nodeList.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                        node => node.uid !== draggedNode.uid
                    );
                    this.treeViewService.nodeList.splice(index + 1, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    } else {
                        this.treeViewService.nodeList = this.treeViewService.nodeList.filter(
                            node => node.uid !== draggedNode.uid
                        );
                    }
                    draggedNode.parent = undefined;
                }
            }
        }
        this.dragging = false;
        this.treeViewService.updateNodeIndices();
        this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
    }

    public onNodeDropPositionChange(event: DropPositionChangeEvent): void {
        this.dropPosition = event.position;
        this.dropTargetNode = event.node;
    }

    public onNodeSelect(node: Node): void {
        const components = this.flattenComponents();
        const component = components.find(component => component.node.uid === node.uid);
        if (component) {
            this.keyManager?.setActiveItem(component);
        }
    }

    private prepareNodeList(): void {
        this.treeViewService.nodeList = [];
        this.treeViewService.viewNodeList = [];
        this.treeViewService.nodeDictionary.clear();
        this.prepareNodeListRecursively(this.data, 0, undefined, this.treeViewService.nodeList);
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        this.treeViewService.updateNodeIndices();
        this.updateDisabledState();
        this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
    }

    private prepareNodeListRecursively(
        root: Iterable<any>,
        index: number,
        parentNode?: Node,
        childNodes?: any[]
    ): void {
        const rootList = new List(root ?? []);
        if (rootList.length === 0) {
            return;
        }
        for (const dataItem of rootList) {
            const nodeId = dataItem[this.keyField];
            const node: Node = new Node<any>({
                key: nodeId,
                data: dataItem,
                checked: false,
                expanded: false,
                selected: false,
                text: dataItem[this.textField],
                nodes: [],
                parent: parentNode,
                index: index++
            });
            if (this.childrenField) {
                this.prepareNodeListRecursively(dataItem[this.childrenField], index, node, node.nodes);
            }
            childNodes?.push(node);
            this.treeViewService.nodeDictionary.add(node.uid, node);
        }
    }

    private setEvents(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                filter(
                    event =>
                        event.key === "ArrowDown" ||
                        event.key === "ArrowUp" ||
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowRight" ||
                        event.key === "Enter" ||
                        event.key === " "
                ),
                takeUntilDestroyed(this.#destroyRef)
            )
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
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.treeViewService.nodeDictionary.values().forEach(n => n.focused.set(false));
            });
    }

    private updateDisabledState(): void {
        if (this.disabler) {
            const disabler = TreeViewService.getNodeDisablerAction(this.disabler);
            for (const node of this.treeViewService.nodeDictionary.values()) {
                node.disabled = disabler(node.data);
            }
        }
    }
}
