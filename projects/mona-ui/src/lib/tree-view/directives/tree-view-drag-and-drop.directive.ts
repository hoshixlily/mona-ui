import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DraggableOptions } from "../../common/tree/models/DraggableOptions";
import { NodeCheckEvent } from "../../common/tree/models/NodeCheckEvent";
import { NodeClickEvent } from "../../common/tree/models/NodeClickEvent";
import { NodeDragEndEvent } from "../../common/tree/models/NodeDragEndEvent";
import { NodeDragEvent } from "../../common/tree/models/NodeDragEvent";
import { NodeDragStartEvent } from "../../common/tree/models/NodeDragStartEvent";
import { NodeDropEvent } from "../../common/tree/models/NodeDropEvent";
import { NodeSelectEvent } from "../../common/tree/models/NodeSelectEvent";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewDragAndDrop]",
    standalone: true
})
export class TreeViewDragAndDropDirective<T> implements OnInit {
    readonly #defaultOptions: DraggableOptions = {
        enabled: true
    };

    @Output()
    public nodeCheck: EventEmitter<NodeCheckEvent<T>> = new EventEmitter();

    @Output()
    public nodeClick: EventEmitter<NodeClickEvent<T>> = new EventEmitter();

    @Output()
    public nodeDrag: EventEmitter<NodeDragEvent<T>> = new EventEmitter();

    @Output()
    public nodeDragEnd: EventEmitter<NodeDragEndEvent<T>> = new EventEmitter();

    @Output()
    public nodeDragStart: EventEmitter<NodeDragStartEvent<T>> = new EventEmitter();

    @Output()
    public nodeDrop: EventEmitter<NodeDropEvent<T>> = new EventEmitter();

    @Output()
    public nodeSelect: EventEmitter<NodeSelectEvent<T>> = new EventEmitter();

    @Input("monaTreeViewDragAndDrop")
    public set options(value: Partial<DraggableOptions> | "") {
        if (value === "") {
            this.treeService.setDraggableOptions(this.#defaultOptions);
        } else {
            this.treeService.setDraggableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.treeService.nodeCheck = this.nodeCheck;
        this.treeService.nodeClick = this.nodeClick;
        this.treeService.nodeDrag = this.nodeDrag;
        this.treeService.nodeDragEnd = this.nodeDragEnd;
        this.treeService.nodeDragStart = this.nodeDragStart;
        this.treeService.nodeDrop = this.nodeDrop;
        this.treeService.nodeSelect = this.nodeSelect;
    }
}
