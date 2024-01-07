import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../../common/list/models/GroupableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewGroupable]",
    standalone: true
})
export class ListViewGroupableDirective<T> {
    readonly #defaultOptions: GroupableOptions<T, any> = {
        enabled: true
    };

    @Input()
    public set groupBy(value: string | Selector<T, any> | null | undefined) {
        this.listService.setGroupBy(value ?? "");
    }

    @Input("monaListViewGroupable")
    public set options(value: GroupableOptions<T, any> | "") {
        if (value === "") {
            this.listService.setGroupableOptions(this.#defaultOptions);
        } else {
            this.listService.setGroupableOptions({
                ...this.#defaultOptions,
                ...value,
                enabled: value.enabled ?? this.#defaultOptions.enabled
            });
        }
    }

    public constructor(private readonly listService: ListService<T>) {}
}
