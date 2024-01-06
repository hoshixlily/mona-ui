import { Directive, Input, SkipSelf } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListGroupable]",
    standalone: true
})
export class ListGroupableDirective<TData> {
    readonly #defaultOptions: GroupableOptions<TData, any> = {
        enabled: true
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
                ...value,
                enabled: value.enabled ?? this.#defaultOptions.enabled
            });
        }
    }

    public constructor(private readonly listService: ListService<TData>) {}
}
