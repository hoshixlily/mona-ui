import { Directive, effect, inject, input, Input, InputSignal, untracked } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListGroupable]",
    standalone: true
})
export class ListGroupableDirective<TData> {
    readonly #defaultOptions: GroupableOptions<TData, any> = {
        enabled: true
    };
    readonly #listService: ListService<TData> = inject(ListService);

    public groupBy: InputSignal<string | Selector<TData, any> | null | undefined> = input<
        string | Selector<TData, any> | null | undefined
    >();
    public options: InputSignal<GroupableOptions<TData, any> | ""> = input<GroupableOptions<TData, any> | "">(
        this.#defaultOptions,
        {
            alias: "monaListGroupable"
        }
    );

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setGroupableOptions(this.#defaultOptions);
                } else {
                    this.#listService.setGroupableOptions({
                        ...this.#defaultOptions,
                        ...options,
                        enabled: options.enabled ?? this.#defaultOptions.enabled
                    });
                }
            });
        });
        effect(() => {
            const groupBy = this.groupBy();
            untracked(() => this.#listService.setGroupBy(groupBy ?? ""));
        });
    }
}
