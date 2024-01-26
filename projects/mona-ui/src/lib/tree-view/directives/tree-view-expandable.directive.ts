import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { ExpandableOptions } from "../../common/tree/models/ExpandableOptions";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewExpandable]",
    standalone: true
})
export class TreeViewExpandableDirective<T> implements OnInit {
    readonly #defaultOptions: ExpandableOptions = {
        enabled: true
    };

    @Input()
    public set expandBy(value: string | Selector<T, any> | null | undefined) {
        this.treeService.setExpandBy(value ?? "");
    }

    @Input()
    public set expandedKeys(value: Iterable<any> | null | undefined) {
        this.treeService.setExpandedKeys(value ?? []);
    }

    @Output()
    public expandedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Input("monaTreeViewExpandable")
    public set options(value: Partial<ExpandableOptions> | "") {
        if (value === "") {
            this.treeService.setExpandableOptions(this.#defaultOptions);
        } else {
            this.treeService.setExpandableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.treeService.expandedKeysChange = this.expandedKeysChange;
        this.treeService.setNodeExpandSubscription();
    }
}
