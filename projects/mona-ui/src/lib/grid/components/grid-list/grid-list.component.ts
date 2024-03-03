import { NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Dictionary, KeyValuePair } from "@mirei/ts-collections";
import { fromEvent, mergeWith } from "rxjs";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { Column } from "../../models/Column";
import { GridGroup } from "../../models/GridGroup";
import { Row } from "../../models/Row";
import { GridGroupPipe } from "../../pipes/grid-group.pipe";
import { GridService } from "../../services/grid.service";
import { GridCellComponent } from "../grid-cell/grid-cell.component";

@Component({
    selector: "mona-grid-list",
    templateUrl: "./grid-list.component.html",
    styleUrls: ["./grid-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        NgClass,
        GridCellComponent,
        ButtonDirective,
        FontAwesomeModule,
        NgTemplateOutlet,
        SlicePipe,
        GridGroupPipe
    ],
    host: {
        class: "mona-grid-list"
    }
})
export class GridListComponent implements OnInit, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly collapseIcon: IconDefinition = faChevronDown;
    protected readonly expandIcon: IconDefinition = faChevronRight;

    public columns: InputSignal<Column[]> = input<Column[]>([]);
    public data: InputSignal<Row[]> = input<Row[]>([]);

    public constructor(
        public readonly gridService: GridService,
        private readonly elementRef: ElementRef<HTMLDivElement>
    ) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.synchronizeHorizontalScroll();
        }, 0);
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
        } else if (event.ctrlKey || event.metaKey) {
            this.gridService.selectedRows.splice(rowIndex, 1);
            row.selected = false;
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
                new Dictionary<number, boolean>([
                    new KeyValuePair<number, boolean>(this.gridService.pageState.page, group.collapsed)
                ])
            );
        } else if (state.containsKey(this.gridService.pageState.page)) {
            const value = state.get(this.gridService.pageState.page);
            if (value != null) {
                state.remove(this.gridService.pageState.page);
                state.add(this.gridService.pageState.page, !value);
            }
        } else {
            state.add(this.gridService.pageState.page, group.collapsed);
        }
    }

    private setSubscriptions(): void {
        fromEvent<MouseEvent>(document, "click")
            .pipe(mergeWith(fromEvent<KeyboardEvent>(document, "keyup")), takeUntilDestroyed(this.#destroyRef))
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
        const gridElement = this.elementRef.nativeElement as HTMLElement;
        if (headerElement == null || gridElement == null) {
            return;
        }
        fromEvent(gridElement, "scroll")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                headerElement.scrollLeft = gridElement.scrollLeft;
            });
    }
}
