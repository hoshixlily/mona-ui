import {
    DestroyRef,
    Directive,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SelectableOptions } from "../models/SelectableOptions";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "mona-grid[monaGridSelectable]",
    standalone: true
})
export class GridSelectableDirective implements OnInit, OnChanges {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    @Input()
    public set selectedKeys(selectedKeys: Iterable<unknown>) {
        this.gridService.selectedKeys.clear();
        this.gridService.selectedKeys.addAll(selectedKeys);
    }

    @Output()
    public selectedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();

    @Input()
    public set selectionKey(selectionKey: string) {
        this.gridService.selectionKeyField = selectionKey;
    }

    @Input("monaGridSelectable")
    public options?: SelectableOptions | "";

    public constructor(private readonly gridService: GridService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
            console.log("selectedKeys", this.gridService.selectedKeys);
        }
    }

    public ngOnInit(): void {
        this.gridService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.gridService.setSelectableOptions(this.options);
        } else if (this.options === "") {
            this.gridService.setSelectableOptions({ enabled: true });
        }
        this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
        this.setSubscriptions();
    }

    private setSubscriptions(): void {
        this.gridService.selectedRowsChange$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(selectedRows => {
            const selectedKeys = selectedRows.map(r =>
                this.gridService.selectionKeyField ? r.data[this.gridService.selectionKeyField] : r.data
            );
            this.gridService.selectedKeys.clear();
            this.gridService.selectedKeys.addAll(selectedKeys);
            this.gridService.selectedKeysChange.next(selectedKeys);
        });
    }
}
