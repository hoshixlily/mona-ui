import { Directive, effect, inject, input, untracked } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../../common/list/models/GroupableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewGroupable]",
    standalone: true
})
export class ListViewGroupableDirective<T> {
    readonly #defaultOptions: GroupableOptions<T, any> = {
        enabled: true
    };
    readonly #listService: ListService<T> = inject(ListService);

    public groupBy = input<string | Selector<T, any> | null | undefined>("");
    public options = input<GroupableOptions<T, any> | "">("", {
        alias: "monaListViewGroupable"
    });

    public constructor() {
        effect(() => {
            const groupBy = this.groupBy();
            untracked(() => {
                this.#listService.setGroupBy(groupBy ?? "");
            });
        });
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
    }
}
