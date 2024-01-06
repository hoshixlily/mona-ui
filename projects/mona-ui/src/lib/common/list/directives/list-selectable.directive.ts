import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ImmutableSet, Selector } from "@mirei/ts-collections";
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
    @Input("monaListSelectable")
    public set options(value: Partial<SelectableOptions> | "") {
        if (value === "") {
            this.listService.setSelectableOptions(this.#defaultOptions);
        } else {
            this.listService.setSelectableOptions({
                ...this.#defaultOptions,
                ...value
            });
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

    @Output()
    public selectedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    public constructor(private readonly listService: ListService<T>) {}

    public ngOnInit(): void {
        this.listService.selectedKeysChange = this.selectedKeysChange;
    }
}
