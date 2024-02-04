import { Directive, Input } from "@angular/core";
import { VirtualScrollOptions } from "../../common/list/models/VirtualScrollOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: `
        mona-auto-complete[monaDropDownVirtualScroll],
        mona-drop-down-list[monaDropDownVirtualScroll],
        mona-combo-box[monaDropDownVirtualScroll],
        mona-multi-select[monaDropDownVirtualScroll]
    `,
    standalone: true
})
export class DropDownVirtualScrollDirective<T> {
    readonly #defaultOptions: VirtualScrollOptions = {
        enabled: true,
        height: 28
    };

    @Input("monaDropDownVirtualScroll")
    public set options(value: Partial<VirtualScrollOptions> | "") {
        if (value === "") {
            this.listService.setVirtualScrollOptions(this.#defaultOptions);
        } else {
            this.listService.setVirtualScrollOptions({
                ...this.#defaultOptions,
                ...value,
                enabled: value.enabled ?? this.#defaultOptions.enabled
            });
        }
    }

    public constructor(private readonly listService: ListService<T>) {}
}
