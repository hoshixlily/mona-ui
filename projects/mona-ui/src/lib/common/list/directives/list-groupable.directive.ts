import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListGroupable]",
    standalone: true
})
export class ListGroupableDirective<TData> {
    readonly #defaultOptions: GroupableOptions<TData, any> = {
        enabled: true,
        headerOrder: "asc"
    };
    @Input()
    public set groupBy(value: string | Selector<TData, any> | null | undefined) {
        this.listService.setGroupBy(value ?? "");
    }

    @Input("monaListGroupable")
    public set options(value: GroupableOptions<TData, any> | "") {
        if (value === "") {
            this.listService.setGroupableOptions(this.#defaultOptions);
        } else {
            this.listService.setGroupableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly listService: ListService<TData>) {}
}
