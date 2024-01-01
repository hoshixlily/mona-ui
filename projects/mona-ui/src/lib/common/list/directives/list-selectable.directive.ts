import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { SelectableOptions } from "../models/SelectableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListSelectable]",
    standalone: true
})
export class ListSelectableDirective<T> {
    @Input("monaListSelectable")
    public set options(value: SelectableOptions | "") {
        if (value === "") {
            this.listService.setSelectableOptions({
                mode: "single",
                enabled: true,
                toggleable: false
            });
        } else {
            this.listService.setSelectableOptions(value);
        }
    }

    @Input()
    public set selectBy(value: string | Selector<T, any> | null | undefined) {
        this.listService.setValueField(value ?? "");
    }

    @Input()
    public set selectedKeys(value: Iterable<any> | null | undefined) {
        this.listService.setSelectedKeys(value ?? []);
    }

    public constructor(private readonly listService: ListService<T>) {}
}
