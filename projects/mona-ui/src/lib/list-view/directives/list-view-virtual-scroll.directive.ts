import { Directive, effect, inject, input, untracked } from "@angular/core";
import { VirtualScrollOptions } from "../../common/models/VirtualScrollOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewVirtualScroll]",
    standalone: true
})
export class ListViewVirtualScrollDirective<T> {
    readonly #listService = inject(ListService<T>);
    public options = input.required<VirtualScrollOptions>({
        alias: "monaListViewVirtualScroll"
    });

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => this.#listService.setVirtualScrollOptions(options));
        });
    }
}
