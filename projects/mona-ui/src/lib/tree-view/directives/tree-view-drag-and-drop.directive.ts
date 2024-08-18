import { Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { DraggableOptions } from "../../common/tree/models/DraggableOptions";
import { NodeDragEndEvent } from "../../common/tree/models/NodeDragEndEvent";
import { NodeDragEvent } from "../../common/tree/models/NodeDragEvent";
import { NodeDragStartEvent } from "../../common/tree/models/NodeDragStartEvent";
import { NodeDropEvent } from "../../common/tree/models/NodeDropEvent";
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

    public readonly nodeDrag = output<NodeDragEvent<T>>();
    public readonly nodeDragEnd = output<NodeDragEndEvent<T>>();
    public readonly nodeDragStart = output<NodeDragStartEvent<T>>();
    public readonly nodeDrop = output<NodeDropEvent<T>>();

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
        this.#treeService.nodeDrag = this.nodeDrag;
        this.#treeService.nodeDragEnd = this.nodeDragEnd;
        this.#treeService.nodeDragStart = this.nodeDragStart;
        this.#treeService.nodeDrop = this.nodeDrop;
    }
}
