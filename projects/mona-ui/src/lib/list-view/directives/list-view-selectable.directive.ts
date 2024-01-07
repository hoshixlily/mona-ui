import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
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

    @Input()
    public set selectedKeys(selectedKeys: Iterable<any>) {
        this.listService.setSelectedKeys(selectedKeys ?? []);
    }

    @Output()
    public selectedKeysChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Input()
    public set selectionKey(key: string | Selector<T, any> | null | undefined) {
        this.listService.setValueField(key ?? "");
    }

    @Input("monaListViewSelectable")
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

    public constructor(private readonly listService: ListService<T>) {}

    public ngOnInit(): void {
        this.listService.selectedKeysChange = this.selectedKeysChange;
    }
}
