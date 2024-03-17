import {
    Directive,
    effect,
    inject,
    input,
    InputSignal,
    OnInit,
    output,
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

    public options: InputSignal<Partial<SelectableOptions> | ""> = input<Partial<SelectableOptions> | "">(
        this.#defaultOptions,
        {
            alias: "monaListViewSelectable"
        }
    );
    public selectedKeys: InputSignal<Iterable<any>> = input<Iterable<any>>([]);
    public selectedKeysChange: OutputEmitterRef<any[]> = output();
    public selectionKey: InputSignal<string | Selector<T, any> | null | undefined> = input<
        string | Selector<T, any> | null | undefined
    >("");

    public constructor() {
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
