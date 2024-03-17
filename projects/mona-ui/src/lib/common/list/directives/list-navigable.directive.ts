import { Directive, effect, inject, input, InputSignal, untracked } from "@angular/core";
import { NavigableOptions } from "../models/NavigableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListNavigable]",
    standalone: true
})
export class ListNavigableDirective<TData> {
    readonly #defaultOptions: NavigableOptions = {
        enabled: true,
        mode: "select",
        wrap: false
    };
    readonly #listService: ListService<TData> = inject(ListService);

    public options: InputSignal<Partial<NavigableOptions> | ""> = input<Partial<NavigableOptions> | "">(
        this.#defaultOptions,
        {
            alias: "monaListNavigable"
        }
    );

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
