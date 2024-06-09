import { Directive, effect, inject, input, untracked } from "@angular/core";
import { NavigableOptions } from "../../common/list/models/NavigableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewNavigable]",
    standalone: true
})
export class ListViewNavigableDirective<T> {
    readonly #defaultOptions: NavigableOptions = {
        enabled: true,
        mode: "select",
        wrap: false
    };
    readonly #listService = inject(ListService<T>);

    public options = input<Partial<NavigableOptions> | "">("", {
        alias: "monaListViewNavigable"
    });

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setNavigableOptions(this.#defaultOptions);
                } else {
                    this.#listService.setNavigableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }
}
