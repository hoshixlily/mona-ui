import { transition, trigger } from "@angular/animations";
import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    OnInit,
    Output
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { NodeClickEvent } from "../../models/NodeClickEvent";
import { NodeSelectEvent } from "../../models/NodeSelectEvent";
import { TreeService } from "../../services/tree.service";
import { SubTreeComponent } from "../sub-tree/sub-tree.component";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "mona-tree",
    standalone: true,
    imports: [SubTreeComponent, TreeNodeComponent, NgTemplateOutlet],
    templateUrl: "./tree.component.html",
    styleUrl: "./tree.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [trigger("nodeExpandParent", [transition(":enter", [])])]
})
export class TreeComponent<T> implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    @Output()
    public nodeClick: EventEmitter<NodeClickEvent<T>> = new EventEmitter();

    @Output()
    public nodeSelect: EventEmitter<NodeSelectEvent<T>> = new EventEmitter();

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        protected readonly treeService: TreeService<T>
    ) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private setFocusSubscription(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                this.treeService.navigatedNode.set(this.treeService.nodeSet().firstOrDefault());
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                this.treeService.navigatedNode.set(null);
            });
    }

    private setKeydownSubscription(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                const navigatedNode = this.treeService.navigatedNode();
                if (event.key === "ArrowUp") {
                    this.treeService.navigate("previous");
                } else if (event.key === "ArrowDown") {
                    this.treeService.navigate("next");
                } else if (event.key === "ArrowLeft") {
                    if (navigatedNode && this.treeService.isExpanded(navigatedNode)) {
                        this.treeService.setNodeExpand(navigatedNode, false);
                    }
                } else if (event.key === "ArrowRight") {
                    if (navigatedNode && !this.treeService.isExpanded(navigatedNode)) {
                        this.treeService.setNodeExpand(navigatedNode, true);
                    }
                } else if (event.key === " ") {
                    if (navigatedNode) {
                        this.treeService.setNodeCheck(navigatedNode, !this.treeService.isChecked(navigatedNode));
                        this.treeService.checkedKeysChange.emit(this.treeService.checkedKeys().toArray());
                    }
                }
            });
    }

    private setNodeClickSubscription(): void {
        this.treeService.nodeClick$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeClick.emit(event));
    }

    private setNodeSelectSubscription(): void {
        this.treeService.nodeSelect$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => this.nodeSelect.emit(event));
    }

    private setSubscriptions(): void {
        this.setFocusSubscription();
        this.setKeydownSubscription();
        this.setNodeClickSubscription();
        this.setNodeSelectSubscription();
    }
}
