import { Directive, Input } from "@angular/core";
import { VirtualScrollOptions } from "../../common/list/models/VirtualScrollOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewVirtualScroll]",
    standalone: true
})
export class ListViewVirtualScrollDirective<T> {
    @Input({
        alias: "monaListViewVirtualScroll",
        required: true
    })
    public set options(value: VirtualScrollOptions) {
        this.listService.setVirtualScrollOptions(value);
    }

    public constructor(private readonly listService: ListService<T>) {}
}
