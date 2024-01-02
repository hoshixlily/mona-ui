import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../../common/list/models/FilterableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: `
        mona-drop-down-list[monaDropDownFilterable],
        mona-combo-box[monaDropDownFilterable]
    `,
    standalone: true
})
export class DropDownFilterableDirective<TData> {
    readonly #defaultOptions: FilterableOptions = {
        enabled: true,
        operator: "contains",
        debounce: 0,
        caseSensitive: false
    };
    @Input()
    public set filter(value: string) {
        this.listService.setFilter(value);
    }

    @Output()
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    @Input()
    public set filterPlaceholder(value: string) {
        this.listService.setFilterPlaceholder(value);
    }

    @Input("monaDropDownFilterable")
    public set options(value: Partial<FilterableOptions> | "") {
        if (value === "") {
            this.listService.setFilterableOptions(this.#defaultOptions);
        } else {
            this.listService.setFilterableOptions({
                ...this.#defaultOptions,
                ...value,
                enabled: value.enabled ?? this.#defaultOptions.enabled
            });
        }
    }

    public constructor(private readonly listService: ListService<TData>) {}

    public ngOnInit(): void {
        this.listService.filterChange = this.filterChange;
    }
}
