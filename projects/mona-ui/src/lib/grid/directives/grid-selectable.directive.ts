import { Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { SelectableOptions } from "../models/SelectableOptions";
import { GridComponent } from "../components/grid/grid.component";
import { GridService } from "../services/grid.service";
import { Subject, takeUntil } from "rxjs";

@Directive({
    selector: "mona-grid[monaGridSelectable]"
})
export class GridSelectableDirective implements OnInit, OnChanges, OnDestroy {
    readonly #destroy$: Subject<void> = new Subject<void>();
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

    public constructor(private readonly grid: GridComponent, private readonly gridService: GridService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
        }
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
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
        this.gridService.selectedRowsChange$.pipe(takeUntil(this.#destroy$)).subscribe(selectedRows => {
            const selectedKeys = selectedRows.map(r =>
                this.gridService.selectionKeyField ? r.data[this.gridService.selectionKeyField] : r.data
            );
            this.gridService.selectedKeys.clear();
            this.gridService.selectedKeys.addAll(selectedKeys);
            this.gridService.selectedKeysChange.next(selectedKeys);
        });
    }
}
