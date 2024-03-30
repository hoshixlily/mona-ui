import { NgClass, NgTemplateOutlet } from "@angular/common";
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
import { Dictionary, ImmutableList, ImmutableSet, KeyValuePair } from "@mirei/ts-collections";
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
    readonly #hostElementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    protected readonly collapseIcon: IconDefinition = faChevronDown;
    protected readonly expandIcon: IconDefinition = faChevronRight;
    protected readonly gridService: GridService = inject(GridService);

    public columns = input<ImmutableList<Column>>(ImmutableList.create());
    public data: InputSignal<ImmutableSet<Row>> = input<ImmutableSet<Row>>(ImmutableSet.create());

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

        this.gridService.selectedRowsChange$.next(this.gridService.selectedRows());
    }

    private isSelectableGrid(): boolean {
        return this.gridService.selectableOptions != null && !!this.gridService.selectableOptions.enabled;
    }

    private handleSingleSelection(event: MouseEvent, row: Row): void {
        if (row.selected() && (event.ctrlKey || event.metaKey)) {
            this.deselectAllRows();
        } else {
            this.deselectAllRows();
            this.selectRow(row);
        }
    }

    private handleMultipleSelection(event: MouseEvent, row: Row): void {
        if (!this.gridService.selectedRows().contains(row)) {
            this.selectRow(row);
        } else if (event.ctrlKey || event.metaKey) {
            row.selected.set(false);
            this.gridService.selectedRows.update(set => set.remove(row));
        }
    }

    private selectRow(row: Row): void {
        row.selected.set(true);
        this.gridService.selectedRows.update(set => set.add(row));
    }

    private deselectAllRows(): void {
        if (this.gridService.selectedRows.length !== 0) {
            this.gridService.selectedRows().forEach(r => r.selected.set(false));
        }
        this.gridService.selectedRows.update(set => set.clear());
    }

    public onGroupExpandChange(group: GridGroup): void {
        group.collapsed = !group.collapsed;
        const groupKey = `${group.column.field}-${group.rows[0].data[group.column.field]}`;
        const state = this.gridService.gridGroupExpandState.get(groupKey);
        if (state == null) {
            this.gridService.gridGroupExpandState.add(
                groupKey,
                new Dictionary<number, boolean>([
                    new KeyValuePair<number, boolean>(this.gridService.pageState.page(), group.collapsed)
                ])
            );
        } else if (state.containsKey(this.gridService.pageState.page())) {
            const value = state.get(this.gridService.pageState.page());
            if (value != null) {
                state.remove(this.gridService.pageState.page());
                state.add(this.gridService.pageState.page(), !value);
            }
        } else {
            state.add(this.gridService.pageState.page(), group.collapsed);
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
                        this.gridService.isInEditMode.set(false);
                    }
                }
                if (e.type === "keyup") {
                    const event = e as KeyboardEvent;
                    if (event.key === "Escape") {
                        this.gridService.isInEditMode.set(false);
                    }
                }
            });
    }

    private synchronizeHorizontalScroll(): void {
        const headerElement = this.gridService.gridHeaderElement;
        const gridElement = this.#hostElementRef.nativeElement as HTMLElement;
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
