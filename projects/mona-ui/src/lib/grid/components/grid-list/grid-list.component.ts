import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { GridService } from "../../services/grid.service";
import { fromEvent, mergeWith, Subject, takeUntil } from "rxjs";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { faChevronDown, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GridGroup } from "../../models/GridGroup";
import { Dictionary, KeyValuePair } from "@mirei/ts-collections";

@Component({
    selector: "mona-grid-list",
    templateUrl: "./grid-list.component.html",
    styleUrls: ["./grid-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default
})
export class GridListComponent implements OnInit, AfterViewInit, OnDestroy {
    readonly #destroy: Subject<void> = new Subject<void>();
    public readonly collapseIcon: IconDefinition = faChevronDown;
    public readonly expandIcon: IconDefinition = faChevronRight;

    @Input()
    public columns: Column[] = [];

    @Input()
    public data: Row[] = [];

    public constructor(
        public readonly gridService: GridService,
        private readonly elementRef: ElementRef<HTMLDivElement>
    ) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.synchronizeHorizontalScroll();
        }, 0);
    }

    public ngOnDestroy(): void {
        this.#destroy.next();
        this.#destroy.complete();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onGridRowClick(event: MouseEvent, row: Row): void {
        if (!this.isSelectableGrid()) {
            return;
        }

        this.gridService.selectableOptions.mode === "single"
            ? this.handleSingleSelection(event, row)
            : this.handleMultipleSelection(event, row);

        this.gridService.selectedRowsChange$.next(this.gridService.selectedRows);
    }

    private isSelectableGrid(): boolean {
        return this.gridService.selectableOptions != null && !!this.gridService.selectableOptions.enabled;
    }

    private handleSingleSelection(event: MouseEvent, row: Row): void {
        if (row.selected && (event.ctrlKey || event.metaKey)) {
            this.deselectAllRows();
        } else {
            row.selected ? this.deselectAllRows() : this.selectRow(row);
        }
    }

    private handleMultipleSelection(event: MouseEvent, row: Row): void {
        const rowIndex = this.gridService.selectedRows.findIndex(r => r === row);

        if (rowIndex === -1) {
            this.selectRow(row);
        } else {
            if (event.ctrlKey || event.metaKey) {
                this.gridService.selectedRows.splice(rowIndex, 1);
                row.selected = false;
            }
        }
    }

    private selectRow(row: Row): void {
        this.deselectAllRows();
        this.gridService.selectedRows = [row];
        row.selected = true;
    }

    private deselectAllRows(): void {
        if (this.gridService.selectedRows.length !== 0) {
            this.gridService.selectedRows.forEach(r => (r.selected = false));
        }
        this.gridService.selectedRows = [];
    }

    public onGroupExpandChange(group: GridGroup): void {
        group.collapsed = !group.collapsed;
        const groupKey = `${group.column.field}-${group.rows[0].data[group.column.field]}`;
        const state = this.gridService.gridGroupExpandState.get(groupKey);
        if (state == null) {
            this.gridService.gridGroupExpandState.add(
                groupKey,
                new Dictionary<number, boolean>(undefined, [
                    new KeyValuePair<number, boolean>(this.gridService.pageState.page, group.collapsed)
                ])
            );
        } else {
            if (state.containsKey(this.gridService.pageState.page)) {
                const value = state.get(this.gridService.pageState.page);
                if (value != null) {
                    state.remove(this.gridService.pageState.page);
                    state.add(this.gridService.pageState.page, !value);
                }
            } else {
                state.add(this.gridService.pageState.page, group.collapsed);
            }
        }
    }

    private setSubscriptions(): void {
        fromEvent<MouseEvent>(document, "click")
            .pipe(mergeWith(fromEvent<KeyboardEvent>(document, "keyup")), takeUntil(this.#destroy))
            .subscribe(e => {
                if (e.type === "click") {
                    const event = e as MouseEvent;
                    const target = event.target as HTMLElement;
                    if (target.closest(".mona-grid-cell") == null) {
                        this.gridService.isInEditMode = false;
                    }
                }
                if (e.type === "keyup") {
                    const event = e as KeyboardEvent;
                    if (event.key === "Escape") {
                        this.gridService.isInEditMode = false;
                    }
                }
            });
    }

    private synchronizeHorizontalScroll(): void {
        const headerElement = this.gridService.gridHeaderElement;
        const gridElement = this.elementRef.nativeElement.querySelector(".mona-grid-list") as HTMLDivElement;
        if (headerElement == null || gridElement == null) {
            return;
        }
        fromEvent(gridElement, "scroll")
            .pipe(takeUntil(this.#destroy))
            .subscribe(() => {
                headerElement.scrollLeft = gridElement.scrollLeft;
            });
    }
}
