import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterChangeEvent } from "../../filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../models/FilterableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListFilterable]",
    standalone: true
})
export class ListFilterableDirective<TData> implements OnInit {
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

    @Input("monaListFilterable")
    public set options(value: FilterableOptions | "") {
        if (value === "") {
            this.listService.setFilterableOptions({
                enabled: true,
                operator: "contains",
                debounce: 0,
                caseSensitive: false
            });
        } else {
            this.listService.setFilterableOptions(value);
        }
    }

    public constructor(private readonly listService: ListService<TData>) {}

    public ngOnInit(): void {
        this.listService.filterChange = this.filterChange;
    }
}
