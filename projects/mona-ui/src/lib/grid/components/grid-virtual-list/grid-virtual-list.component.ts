import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgClass } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { EnumerableSet, from, ImmutableList, ImmutableSet } from "@mirei/ts-collections";
import { fromEvent } from "rxjs";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { ContainsPipe } from "../../../pipes/contains.pipe";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { Column } from "../../models/Column";
import { VirtualGridGroup, VirtualGridRow } from "../../models/GridGroup";
import { Row } from "../../models/Row";
import { GridService } from "../../services/grid.service";
import { cellComparer } from "../../utilities/GridUtils";
import { GridCellComponent } from "../grid-cell/grid-cell.component";

@Component({
    selector: "mona-grid-virtual-list",
    standalone: true,
    imports: [
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        GridCellComponent,
        NgClass,
        ButtonDirective,
        FaIconComponent,
        SlicePipe,
        ContainsPipe
    ],
    templateUrl: "./grid-virtual-list.component.html",
    styleUrl: "./grid-virtual-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridVirtualListComponent implements AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    protected readonly collapseIcon = faChevronDown;
    protected readonly collapsedGroups = signal<ImmutableSet<string>>(ImmutableSet.create());
    protected readonly expandIcon = faChevronRight;
    protected readonly gridService: GridService = inject(GridService);
    protected readonly virtualGridRows = computed(() => {
        const data = this.data();
        const columns = this.gridService.groupColumns();
        const collapsedGroups = this.collapsedGroups();
        const rows = this.flattenGroups(this.createGridGroup(data, columns), 0, null);
        return rows
            .where(row => {
                const parents = this.getAllParents(row);
                return parents.every(p => p.type === "group" && !collapsedGroups.contains(p.groupId));
            })
            .toImmutableSet();
    });
    public columns = input<ImmutableList<Column>>(ImmutableList.create());
    public data = input<ImmutableSet<Row>>(ImmutableSet.create());

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.synchronizeHorizontalScroll();
        }, 0);
    }

    public onGroupExpandChange(rowItem: VirtualGridRow): void {
        if (rowItem.type === "group") {
            const groupId = rowItem.groupId;
            this.collapsedGroups.update(groups => {
                if (groups.contains(groupId)) {
                    return groups.remove(groupId);
                }
                return groups.add(groupId);
            });
        }
    }

    private createGridGroup(rows: Iterable<Row>, columns: Iterable<Column>): VirtualGridGroup[] {
        const columnEnumerable = from(columns);
        const rowsEnumerable = from(rows);

        if (!columnEnumerable.any()) {
            return [];
        }

        if (columnEnumerable.count() === 1) {
            const column = columnEnumerable.first();
            const grouped = rowsEnumerable.groupBy(row => row.data[column.field()], cellComparer(column));
            return grouped
                .select<VirtualGridGroup>(g => {
                    const rows = g.source.toArray();
                    return {
                        column,
                        rows,
                        collapsed: signal(false),
                        title: rows[0].data[column.field()],
                        uid: this.getGroupKey(column.field(), rows)
                    };
                })
                .toArray();
        }

        const firstColumn = columnEnumerable.first();
        const remainingColumns = columnEnumerable.skip(1);
        const grouped = rowsEnumerable.groupBy(row => row.data[firstColumn.field()], cellComparer(firstColumn));
        return grouped
            .select<VirtualGridGroup>(g => {
                const rows = g.source.toArray();
                return {
                    column: firstColumn,
                    rows: this.createGridGroup(g.source, remainingColumns),
                    collapsed: signal(false),
                    title: rows[0].data[firstColumn.field()],
                    uid: this.getGroupKey(firstColumn.field(), rows)
                };
            })
            .toArray();
    }

    private flattenGroups(
        groups: VirtualGridGroup[],
        level: number,
        parentHeader: VirtualGridRow | null
    ): EnumerableSet<VirtualGridRow> {
        const result = new EnumerableSet<VirtualGridRow>();
        for (const group of groups) {
            if (group.rows.length === 0) {
                continue;
            }
            const headerRow: VirtualGridRow = {
                type: "group",
                column: group.column,
                level,
                groupTitle: group.title,
                groupId: group.uid,
                parent: parentHeader
            };
            result.add(headerRow);
            if (group.rows[0] instanceof Row) {
                const rows = group.rows.map<VirtualGridRow>(row => ({
                    type: "row",
                    row: row as Row,
                    column: group.column,
                    level,
                    groupId: group.uid,
                    parent: headerRow
                }));
                result.addAll(rows);
            } else {
                result.addAll(this.flattenGroups(group.rows as VirtualGridGroup[], level + 1, headerRow));
            }
        }
        return new EnumerableSet<VirtualGridRow>(result);
    }

    private getAllParents(row: VirtualGridRow): VirtualGridRow[] {
        const parents: VirtualGridRow[] = [];
        let currentRow = row.parent;
        while (currentRow != null) {
            parents.push(currentRow);
            currentRow = currentRow.parent;
        }
        return parents;
    }

    private getGroupKey(field: string, rows: Row[]): string {
        return `${field}-${rows[0].data[field]}`;
    }

    private synchronizeHorizontalScroll(): void {
        const headerElement = this.gridService.gridHeaderElement();
        const gridElement = this.#hostElementRef.nativeElement as HTMLElement;
        if (headerElement == null || gridElement == null) {
            return;
        }
        const scrollableElement = gridElement.querySelector(".cdk-virtual-scroll-viewport") as HTMLElement;
        fromEvent(scrollableElement, "scroll")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                headerElement.scrollLeft = scrollableElement.scrollLeft;
            });
    }
}
