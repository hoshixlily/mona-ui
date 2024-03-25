import { Directive, effect, inject, input, OnInit, output, OutputEmitterRef, untracked } from "@angular/core";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../../common/models/FilterableOptions";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewFilterable]",
    standalone: true
})
export class TreeViewFilterableDirective<T> implements OnInit {
    readonly #defaultOptions: FilterableOptions = {
        enabled: true,
        operator: "contains",
        caseSensitive: false,
        debounce: 0
    };
    readonly #treeService: TreeService<T> = inject(TreeService);

    public readonly filterChange: OutputEmitterRef<FilterChangeEvent> = output();

    public filter = input<string>("");
    public filterPlaceholder = input<string>("");
    public options = input<Partial<FilterableOptions> | "">("", {
        alias: "monaTreeViewFilterable"
    });

    public constructor() {
        effect(() => {
            const filter = this.filter();
            untracked(() => this.#treeService.filter$.next(filter));
        });
        effect(() => {
            const filterPlaceholder = this.filterPlaceholder();
            untracked(() => this.#treeService.filterPlaceholder.set(filterPlaceholder));
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#treeService.setFilterableOptions(this.#defaultOptions);
                } else {
                    this.#treeService.setFilterableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#treeService.filterChange = this.filterChange;
    }
}
