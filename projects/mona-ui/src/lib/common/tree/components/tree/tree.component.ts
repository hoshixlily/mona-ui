import { transition, trigger } from "@angular/animations";
import { NgTemplateOutlet } from "@angular/common";
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { TreeService } from "../../services/tree.service";
import { SubTreeComponent } from "../sub-tree/sub-tree.component";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-tree",
    standalone: true,
    imports: [SubTreeComponent, TreeNodeComponent, NgTemplateOutlet],
    templateUrl: "./tree.component.html",
    styleUrl: "./tree.component.scss",
    animations: [trigger("nodeExpandParent", [transition(":enter", [])])]
})
export class TreeComponent<T> implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    @Output()
    public nodeClick: EventEmitter<NodeClickEvent<T>> = new EventEmitter();

    public constructor(protected readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private setNodeClickSubscription(): void {
        this.treeService.nodeClick$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeClick.emit(event));
    }

    private setSubscriptions(): void {
        this.setNodeClickSubscription();
    }
}
