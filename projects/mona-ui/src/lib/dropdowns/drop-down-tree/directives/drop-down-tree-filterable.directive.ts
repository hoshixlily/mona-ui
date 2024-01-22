import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../../../common/models/FilterableOptions";
import { TreeService } from "../../../common/tree/services/tree.service";

@Directive({
    selector: "mona-drop-down-tree[monaDropDownTreeFilterable]",
    standalone: true
})
export class DropDownTreeFilterableDirective<T> implements OnInit {
    readonly #defaultOptions: FilterableOptions = {
        enabled: true,
        operator: "contains",
        caseSensitive: false,
        debounce: 0
    };

    @Input()
    public set filter(value: string) {
        this.treeService.filter$.next(value);
    }

    @Output()
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    @Input("monaDropDownTreeFilterable")
    public set options(value: Partial<FilterableOptions> | "") {
        if (value === "") {
            this.treeService.setFilterableOptions(this.#defaultOptions);
        } else {
            this.treeService.setFilterableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.treeService.filterChange = this.filterChange;
    }
}
