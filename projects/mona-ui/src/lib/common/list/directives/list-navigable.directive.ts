import { Directive, Input } from "@angular/core";
import { NavigableOptions } from "../models/NavigableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListNavigable]",
    standalone: true
})
export class ListNavigableDirective<TData> {
    readonly #defaultOptions: NavigableOptions = {
        enabled: true,
        mode: "select",
        wrap: false
    };
    @Input("monaListNavigable")
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

    public constructor(private readonly listService: ListService<TData>) {}
}
