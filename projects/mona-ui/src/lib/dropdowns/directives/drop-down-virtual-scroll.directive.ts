import { Directive, effect, inject, input, untracked } from "@angular/core";
import { VirtualScrollOptions } from "../../common/list/models/VirtualScrollOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: `
        mona-auto-complete[monaDropDownVirtualScroll],
        mona-drop-down-list[monaDropDownVirtualScroll],
        mona-combo-box[monaDropDownVirtualScroll],
        mona-multi-select[monaDropDownVirtualScroll]
    `,
    standalone: true
})
export class DropDownVirtualScrollDirective<T> {
    readonly #defaultOptions: VirtualScrollOptions = {
        enabled: true,
        height: 28
    };
    readonly #listService: ListService<T> = inject(ListService);

    public options = input<Partial<VirtualScrollOptions> | "">("");

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setVirtualScrollOptions(this.#defaultOptions);
                } else {
                    this.#listService.setVirtualScrollOptions({
                        ...this.#defaultOptions,
                        ...options,
                        enabled: options.enabled ?? this.#defaultOptions.enabled
                    });
                }
            });
        });
    }
}
