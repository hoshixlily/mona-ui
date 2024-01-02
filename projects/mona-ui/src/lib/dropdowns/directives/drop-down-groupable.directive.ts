import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../../common/list/models/GroupableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: `
        mona-drop-down-list[monaDropDownGroupable],
        mona-combo-box[monaDropDownGroupable]
    `,
    standalone: true
})
export class DropDownGroupableDirective<TData> {
    readonly #defaultOptions: GroupableOptions<TData, any> = {
        enabled: true,
        headerOrder: "asc"
    };

    @Input({ required: true })
    public set groupBy(value: string | Selector<TData, any> | null | undefined) {
        this.listService.setGroupBy(value ?? "");
    }

    @Input("monaDropDownGroupable")
    public set options(value: GroupableOptions<TData, any> | "") {
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

    public constructor(private readonly listService: ListService<TData>) {}
}
