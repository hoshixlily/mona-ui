import {
    Directive,
    effect,
    inject,
    input,
    Input,
    InputSignal,
    OnInit,
    output,
    OutputEmitterRef,
    untracked
} from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { SelectableOptions } from "../models/SelectableOptions";
import { ListService } from "../services/list.service";

@Directive({
    selector: "mona-list[monaListSelectable]",
    standalone: true
})
export class ListSelectableDirective<T> implements OnInit {
    readonly #defaultOptions: SelectableOptions = {
        mode: "single",
        enabled: true,
        toggleable: false
    };
    readonly #listService: ListService<T> = inject(ListService);

    public readonly selectedKeysChange: OutputEmitterRef<any[]> = output();
    public options: InputSignal<Partial<SelectableOptions> | ""> = input<Partial<SelectableOptions> | "">(
        this.#defaultOptions,
        {
            alias: "monaListSelectable"
        }
    );
    public selectBy: InputSignal<string | Selector<T, any> | null | undefined> = input<
        string | Selector<T, any> | null | undefined
    >("");
    public selectedKeys: InputSignal<Iterable<any> | null | undefined> = input<Iterable<any> | null | undefined>([]);

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
        effect(() => {
            const selectBy = this.selectBy();
            untracked(() => this.#listService.setValueField(selectBy ?? ""));
        });
        effect(() => {
            const selectedKeys = this.selectedKeys();
            untracked(() => this.#listService.setSelectedKeys(selectedKeys ?? []));
        });
    }

    public ngOnInit(): void {
        this.#listService.selectedKeysChange = this.selectedKeysChange;
    }
}
