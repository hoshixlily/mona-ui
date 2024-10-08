import { DestroyRef, Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { orderBy, select, sequenceEqual } from "@mirei/ts-collections";
import { pairwise, startWith } from "rxjs";
import { SelectableOptions } from "../models/SelectableOptions";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "mona-grid[monaGridSelectable]",
    standalone: true
})
export class GridSelectableDirective implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #gridService: GridService = inject(GridService);

    public readonly selectedKeysChange = output<unknown[]>();
    public options = input<SelectableOptions | "" | undefined>(undefined, {
        alias: "monaGridSelectable"
    });
    public selectBy = input<string>("");
    public selectedKeys = input<Iterable<unknown>>([]);

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options) {
                    this.#gridService.setSelectableOptions(options);
                } else if (options === "") {
                    this.#gridService.setSelectableOptions({ enabled: true });
                }
            });
        });
        effect(() => {
            const selectionKey = this.selectBy();
            untracked(() => {
                this.#gridService.selectBy.set(selectionKey);
            });
        });
        effect(() => {
            const selectedKeys = this.selectedKeys();
            untracked(() => {
                const alreadySelectedKeys = this.#gridService.selectedKeys();
                if (
                    sequenceEqual(
                        orderBy(alreadySelectedKeys, k => k),
                        orderBy(selectedKeys, k => k)
                    )
                ) {
                    return;
                }
                this.#gridService.loadSelectedKeys(selectedKeys);
            });
        });
    }

    public ngOnInit(): void {
        this.#gridService.selectedKeysChange = this.selectedKeysChange;
        this.setSubscriptions();
    }

    private setSubscriptions(): void {
        this.#gridService.selectedRowsChange$
            .pipe(startWith(this.#gridService.selectedRows()), pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([oldRows, newRows]) => {
                const oldRowUidList = select(oldRows, r => r.uid).orderBy(u => u);
                const newRowUidList = select(newRows, r => r.uid).orderBy(u => u);
                if (oldRowUidList.sequenceEqual(newRowUidList)) {
                    return;
                }
                const selectedKeys = select(newRows, r =>
                    this.#gridService.selectBy() ? r.data[this.#gridService.selectBy()] : r.data
                );
                this.#gridService.selectedKeys.update(set => set.clear().addAll(selectedKeys));
                this.#gridService.selectedKeysChange.emit(selectedKeys.toArray());
            });
    }
}
