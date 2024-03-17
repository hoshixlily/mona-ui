import { Directive, effect, inject, input, InputSignal, untracked } from "@angular/core";
import { VirtualScrollOptions } from "../models/VirtualScrollOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListVirtualScroll]",
    standalone: true
})
export class ListVirtualScrollDirective<T> {
    readonly #defaultOptions: VirtualScrollOptions = {
        enabled: true,
        height: 28
    };
    readonly #listService: ListService<T> = inject(ListService);

    public options: InputSignal<Partial<VirtualScrollOptions> | ""> = input<Partial<VirtualScrollOptions> | "">(
        this.#defaultOptions,
        {
            alias: "monaListVirtualScroll"
        }
    );

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setVirtualScrollOptions(this.#defaultOptions);
                } else {
                    this.#listService.setVirtualScrollOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }
}
