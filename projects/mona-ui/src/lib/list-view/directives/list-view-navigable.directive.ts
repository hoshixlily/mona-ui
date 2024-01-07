import { Directive, Input } from "@angular/core";
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

    @Input("monaListViewNavigable")
    public set options(value: Partial<NavigableOptions> | "") {
        if (value === "") {
            this.listService.setNavigableOptions(this.#defaultOptions);
        } else {
            this.listService.setNavigableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly listService: ListService<T>) {}
}
