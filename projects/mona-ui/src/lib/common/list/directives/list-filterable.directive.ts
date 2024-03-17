import {
    Directive,
    effect,
    inject,
    input,
    InputSignal,
    OnInit,
    output,
    OutputEmitterRef,
    untracked
} from "@angular/core";
import { FilterChangeEvent } from "../../filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../../models/FilterableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListFilterable]",
    standalone: true
})
export class ListFilterableDirective<TData> implements OnInit {
    readonly #defaultOptions: FilterableOptions = {
        enabled: true,
        operator: "contains",
        debounce: 0,
        caseSensitive: false
    };
    readonly #listService: ListService<TData> = inject(ListService);

    public filter: InputSignal<string> = input<string>("");
    public filterChange: OutputEmitterRef<FilterChangeEvent> = output();
    public filterPlaceholder: InputSignal<string> = input<string>("");
    public options: InputSignal<Partial<FilterableOptions> | ""> = input<Partial<FilterableOptions> | "">(
        this.#defaultOptions,
        {
            alias: "monaListFilterable"
        }
    );

    public constructor() {
        effect(() => {
            const filter = this.filter();
            untracked(() => {
                this.#listService.setFilter(filter);
            });
        });
        effect(() => {
            const filterPlaceholder = this.filterPlaceholder();
            untracked(() => {
                this.#listService.setFilterPlaceholder(filterPlaceholder);
            });
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setFilterableOptions(this.#defaultOptions);
                } else {
                    this.#listService.setFilterableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#listService.filterChange = this.filterChange;
    }
}
