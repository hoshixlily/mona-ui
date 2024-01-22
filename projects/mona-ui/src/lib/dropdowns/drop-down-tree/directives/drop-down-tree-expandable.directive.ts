import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { ExpandableOptions } from "../../../common/tree/models/ExpandableOptions";
import { TreeService } from "../../../common/tree/services/tree.service";

@Directive({
    selector: "mona-drop-down-tree[monaDropDownTreeExpandable]",
    standalone: true
})
export class DropDownTreeExpandableDirective<T> implements OnInit {
    readonly #defaultOptions: ExpandableOptions = {
        enabled: true
    };

    @Input()
    public set expandBy(value: string | Selector<T, any> | null | undefined) {
        this.treeService.setExpandBy(value ?? "");
    }

    @Input()
    public set expandedKeys(expandedKeys: Iterable<unknown>) {
        this.treeService.setExpandedKeys(expandedKeys);
    }

    @Output()
    public expandedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();

    @Input("monaDropDownTreeExpandable")
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
