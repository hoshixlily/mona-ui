import { Directive, effect, inject, input, OnInit, output, OutputEmitterRef, untracked } from "@angular/core";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { ListService } from "../../common/list/services/list.service";
import { FilterableOptions } from "../../common/models/FilterableOptions";

@Directive({
    selector: `
        mona-auto-complete[monaDropDownFilterable],
        mona-drop-down-list[monaDropDownFilterable],
        mona-combo-box[monaDropDownFilterable],
        mona-multi-select[monaDropDownFilterable]
    `,
    standalone: true
})
export class DropDownFilterableDirective<TData> implements OnInit {
    readonly #defaultOptions: FilterableOptions = {
        enabled: true,
        operator: "contains",
        debounce: 0,
        caseSensitive: false
    };
    readonly #listService: ListService<TData> = inject(ListService);

    public readonly filterChange: OutputEmitterRef<FilterChangeEvent> = output();

    public filter = input<string>("");
    public filterPlaceholder = input<string>("");
    public options = input<Partial<FilterableOptions> | "">("", {
        alias: "monaDropDownFilterable"
    });

    public constructor() {
        effect(() => {
            const filter = this.filter();
            untracked(() => this.#listService.setFilter(filter));
        });
        effect(() => {
            const filterPlaceholder = this.filterPlaceholder();
            untracked(() => this.#listService.setFilterPlaceholder(filterPlaceholder));
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setFilterableOptions(this.#defaultOptions);
                } else {
                    this.#listService.setFilterableOptions({
                        ...this.#defaultOptions,
                        ...options,
                        enabled: options.enabled ?? this.#defaultOptions.enabled
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#listService.filterChange = this.filterChange;
    }
}
