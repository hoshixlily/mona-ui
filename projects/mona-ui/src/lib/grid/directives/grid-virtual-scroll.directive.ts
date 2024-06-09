import { Directive, effect, inject, input, untracked } from "@angular/core";
import { VirtualScrollOptions } from "../../common/models/VirtualScrollOptions";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "mona-grid[monaGridVirtualScroll]",
    standalone: true
})
export class GridVirtualScrollDirective {
    readonly #defaultOptions: VirtualScrollOptions = {
        enabled: true,
        height: 28
    };
    readonly #gridService = inject(GridService);
    public options = input<Partial<VirtualScrollOptions> | "" | undefined>(undefined, {
        alias: "monaGridVirtualScroll"
    });

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options) {
                    this.#gridService.setVirtualScrollOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                } else if (options === "") {
                    this.#gridService.setVirtualScrollOptions(this.#defaultOptions);
                }
            });
        });
    }
}
