import { Directive, effect, inject, input, OnInit, output, Output, OutputEmitterRef, untracked } from "@angular/core";
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
    readonly #treeService: TreeService<T> = inject(TreeService);

    public readonly nodeCheck: OutputEmitterRef<NodeCheckEvent<T>> = output();
    public readonly nodeClick: OutputEmitterRef<NodeClickEvent<T>> = output();
    public readonly nodeDrag: OutputEmitterRef<NodeDragEvent<T>> = output();
    public readonly nodeDragEnd: OutputEmitterRef<NodeDragEndEvent<T>> = output();
    public readonly nodeDragStart: OutputEmitterRef<NodeDragStartEvent<T>> = output();
    public readonly nodeDrop: OutputEmitterRef<NodeDropEvent<T>> = output();
    public readonly nodeSelect: OutputEmitterRef<NodeSelectEvent<T>> = output();

    public options = input<Partial<DraggableOptions> | "">("", {
        alias: "monaTreeViewDragAndDrop"
    });

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#treeService.setDraggableOptions(this.#defaultOptions);
                } else {
                    this.#treeService.setDraggableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#treeService.nodeCheck = this.nodeCheck;
        this.#treeService.nodeClick = this.nodeClick;
        this.#treeService.nodeDrag = this.nodeDrag;
        this.#treeService.nodeDragEnd = this.nodeDragEnd;
        this.#treeService.nodeDragStart = this.nodeDragStart;
        this.#treeService.nodeDrop = this.nodeDrop;
        this.#treeService.nodeSelect = this.nodeSelect;
    }
}
