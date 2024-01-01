import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListGroupable]",
    standalone: true
})
export class ListGroupableDirective<TData> {
    @Input()
    public set groupBy(value: string | Selector<TData, any> | null | undefined) {
        this.listService.setGroupBy(value ?? "");
    }

    @Input("monaListGroupable")
    public set options(value: GroupableOptions<TData, any> | "") {
        if (value === "") {
            this.listService.setGroupableOptions({
                enabled: true,
                headerOrder: "asc"
            });
        } else {
            this.listService.setGroupableOptions(value);
        }
    }

    public constructor(private readonly listService: ListService<TData>) {}
}
