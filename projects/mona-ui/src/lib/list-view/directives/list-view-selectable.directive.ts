import { Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { ListKeySelector } from "../../common/list/models/ListSelectors";
import { SelectableOptions } from "../../common/list/models/SelectableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewSelectable]",
    standalone: true
})
export class ListViewSelectableDirective<T, K = T> implements OnInit {
    readonly #defaultOptions: SelectableOptions = {
        mode: "single",
        enabled: true,
        toggleable: false
    };
    readonly #listService = inject(ListService<T>);

    public readonly selectedKeysChange = output<Array<K>>();
    public options = input<Partial<SelectableOptions> | "">("", {
        alias: "monaListViewSelectable"
    });
    public selectedKeys = input<Iterable<K>>([]);
    public selectionKey = input<ListKeySelector<T, K> | undefined>("");

    public constructor() {
        effect(() => {
            const selectionKey = this.selectionKey();
            untracked(() => {
                this.#listService.setValueField(selectionKey ?? "");
            });
        });
        effect(() => {
            const selectedKeys = this.selectedKeys();
            untracked(() => {
                this.#listService.setSelectedKeys(selectedKeys ?? []);
            });
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#listService.setSelectableOptions(this.#defaultOptions);
                } else {
                    this.#listService.setSelectableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#listService.selectedKeysChange = this.selectedKeysChange;
    }
}
