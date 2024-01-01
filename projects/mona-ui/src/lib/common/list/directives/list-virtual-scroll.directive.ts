import { Directive, Input } from "@angular/core";
import { VirtualScrollOptions } from "../models/VirtualScrollOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListVirtualScroll]",
    standalone: true
})
export class ListVirtualScrollDirective<T> {
    @Input("monaListVirtualScroll")
    public set options(value: VirtualScrollOptions | "") {
        if (value === "") {
            this.listService.setVirtualScrollOptions({
                enabled: true,
                height: 28
            });
        } else {
            this.listService.setVirtualScrollOptions(value);
        }
    }

    public constructor(private readonly listService: ListService<T>) {}
}
