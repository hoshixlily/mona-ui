import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { SelectableOptions } from "../models/SelectableOptions";
import { ListViewService } from "../services/list-view.service";

@Directive({
    selector: "mona-list-view[monaListViewSelectable]",
    standalone: true
})
export class ListViewSelectableDirective implements OnInit, OnChanges {
    @Input()
    public set selectedKeys(selectedKeys: Iterable<any>) {
        this.listViewService.selectedKeys.clear();
        this.listViewService.selectedKeys.addAll(selectedKeys);
    }

    @Output()
    public selectedKeysChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Input()
    public set selectionKey(key: any) {
        this.listViewService.selectionKey = key;
    }

    @Input("monaListViewSelectable")
    public options?: Partial<SelectableOptions> | "";

    public constructor(private readonly listViewService: ListViewService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.listViewService.loadSelectedKeys(this.listViewService.selectedKeys);
        }
    }

    public ngOnInit(): void {
        this.listViewService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.listViewService.setSelectableOptions(this.options);
        } else if (this.options === "") {
            this.listViewService.setSelectableOptions({ enabled: true });
        }
        this.listViewService.loadSelectedKeys(this.listViewService.selectedKeys);
    }
}
