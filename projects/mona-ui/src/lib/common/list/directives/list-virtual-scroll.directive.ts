import { Directive, Input } from "@angular/core";
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
    @Input("monaListVirtualScroll")
    public set options(value: Partial<VirtualScrollOptions> | "") {
        if (value === "") {
            this.listService.setVirtualScrollOptions(this.#defaultOptions);
        } else {
            this.listService.setVirtualScrollOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly listService: ListService<T>) {}
}
