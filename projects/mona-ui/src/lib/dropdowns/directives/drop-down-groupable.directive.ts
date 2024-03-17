import { Directive, effect, inject, input, InputSignal, untracked } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../../common/list/models/GroupableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: `
        mona-auto-complete[monaDropDownGroupable],
        mona-combo-box[monaDropDownGroupable],
        mona-drop-down-list[monaDropDownGroupable],
        mona-multi-select[monaDropDownGroupable],
    `,
    standalone: true
})
export class DropDownGroupableDirective<TData> {
    readonly #defaultOptions: GroupableOptions<TData, any> = {
        enabled: true,
        headerOrder: "asc"
    };
    readonly #listService: ListService<TData> = inject(ListService);

    public groupBy: InputSignal<string | Selector<TData, any> | null | undefined> = input.required<
        string | Selector<TData, any> | null | undefined
    >();
    public options: InputSignal<GroupableOptions<TData, any> | ""> = input<GroupableOptions<TData, any> | "">("", {
        alias: "monaDropDownGroupable"
    });

    public constructor() {
        effect(() => {
            const groupBy = this.groupBy();
            untracked(() => {
                this.#listService.setGroupBy(groupBy ?? "");
            });
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setGroupableOptions(this.#defaultOptions);
                } else {
                    this.#listService.setGroupableOptions({
                        ...this.#defaultOptions,
                        ...options,
                        enabled: options.enabled ?? this.#defaultOptions.enabled
                    });
                }
            });
        });
    }
}
