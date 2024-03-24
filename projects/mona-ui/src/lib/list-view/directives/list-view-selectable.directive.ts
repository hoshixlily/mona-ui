import {
    Directive,
    effect,
    EventEmitter,
    inject,
    input,
    Input,
    OnInit,
    output,
    Output,
    OutputEmitterRef,
    untracked
} from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { SelectableOptions } from "../../common/list/models/SelectableOptions";
import { ListService } from "../../common/list/services/list.service";

@Directive({
    selector: "mona-list-view[monaListViewSelectable]",
    standalone: true
})
export class ListViewSelectableDirective<T> implements OnInit {
    readonly #defaultOptions: SelectableOptions = {
        mode: "single",
        enabled: true,
        toggleable: false
    };
    readonly #listService: ListService<T> = inject(ListService);

    public readonly selectedKeysChange: OutputEmitterRef<any[]> = output();
    public options = input<Partial<SelectableOptions> | "">("", {
        alias: "monaListViewSelectable"
    });
    public selectedKeys = input<Iterable<any>>([]);
    public selectionKey = input<string | Selector<T, any> | null | undefined>("");

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
