import { Directive, Input } from "@angular/core";
import { VirtualScrollOptions } from "../models/VirtualScrollOptions";
import { ListViewService } from "../services/list-view.service";

@Directive({
    selector: "mona-list-view[monaListViewVirtualScroll]"
})
export class ListViewVirtualScrollDirective {
    @Input({
        alias: "monaListViewVirtualScroll",
        required: true
    })
    public options: VirtualScrollOptions = { enabled: true, itemHeight: 30 };

    public constructor(private readonly listViewService: ListViewService) {}

    public ngOnInit(): void {
        this.listViewService.setVirtualScrollOptions(this.options);
    }
}
