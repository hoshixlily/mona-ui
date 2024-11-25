import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import {
    afterNextRender,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    Injector,
    input,
    OnInit,
    signal,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { EnumerableSet, from, ImmutableList, ImmutableSet } from "@mirei/ts-collections";
import { fromEvent, pairwise, startWith } from "rxjs";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { ContextMenuComponent } from "../../../menus/context-menu/context-menu.component";
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
    imports: [
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        GridCellComponent,
        ButtonDirective,
        FaIconComponent,
        SlicePipe,
        ContainsPipe,
        NgTemplateOutlet,
        ContextMenuComponent
    ],
    templateUrl: "./grid-virtual-list.component.html",
    styleUrl: "./grid-virtual-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridVirtualListComponent implements OnInit, AfterViewInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #hostElementRef = inject(ElementRef<HTMLDivElement>);
    readonly #groupColumns$ = toObservable(inject(GridService).groupColumns);
    readonly #injector = inject(Injector);
    readonly #virtualGridRows = computed(() => {
        const data = this.data();
        const columns = this.gridService.groupColumns();
        const rows = this.flattenGroups(this.createGridGroup(data, columns), 0, null);
        return rows.toImmutableSet();
    });
    protected readonly collapseIcon = faChevronDown;
    protected readonly collapsedGroups = signal<ImmutableSet<string>>(ImmutableSet.create());
    protected readonly expandIcon = faChevronRight;
    protected readonly gridService = inject(GridService);
    protected readonly groupedGridRows = computed(() => {
        const collapsedGroups = this.collapsedGroups();
        const rows = this.#virtualGridRows();
        return rows
            .where(row => {
                const parents = row.parentList;
                return parents.every(p => p.type === "group" && !collapsedGroups.contains(p.groupId));
            })
            .toImmutableList();
    });
    protected readonly viewport = viewChild.required(CdkVirtualScrollViewport);
    public columns = input<ImmutableList<Column>>(ImmutableList.create());
    public data = input<ImmutableSet<Row>>(ImmutableSet.create());

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.synchronizeHorizontalScroll();
        }, 0);
    }

    public ngOnInit(): void {
        this.setSubscriptions();
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

    public onGridRowClick(event: MouseEvent, row: Row): void {
        this.gridService.handleRowClick(event, row);
    }

    public onToggleDetailClick(event: MouseEvent, row: VirtualGridRow | Row): void {
        event.stopPropagation();
        if (row instanceof Row) {
            row.detailVisible.update(v => !v);
        } else if (row.type === "row") {
            row.row.detailVisible.update(v => !v);
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
                        key: this.getGroupKey(column.field(), rows),
                        rows,
                        title: rows[0].data[column.field()]
                    } as VirtualGridGroup;
                })
                .toArray();
        }

        const firstColumn = columnEnumerable.first();
        const remainingColumns = columnEnumerable.skip(1);
        const grouped = rowsEnumerable.groupBy(row => row.data[firstColumn.field()], cellComparer(firstColumn));
        return grouped
            .select<VirtualGridGroup>(g => {
                const rows = g.source.toArray();
                const groupedRows = this.createGridGroup(g.source, remainingColumns);
                return {
                    column: firstColumn,
                    key: this.getGroupKey(firstColumn.field(), rows),
                    rows: groupedRows,
                    title: rows[0].data[firstColumn.field()]
                } as VirtualGridGroup;
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
            const parentList = [...(parentHeader?.parentList ?? []), parentHeader].filter(
                p => p != null
            ) as VirtualGridRow[];
            const groupId = this.getNestedGroupKey(parentList, group.key);
            const headerRow: VirtualGridRow = {
                type: "group",
                column: group.column,
                level,
                groupTitle: group.title,
                groupId,
                parentList
            };
            result.add(headerRow);
            if (group.rows[0] instanceof Row) {
                const parentList = [...headerRow.parentList, headerRow].filter(p => p != null) as VirtualGridRow[];
                const groupId = this.getNestedGroupKey(parentList, group.key);
                const rows = group.rows.map<VirtualGridRow>(row => ({
                    type: "row",
                    row: row as Row,
                    column: group.column,
                    level,
                    groupId,
                    parentList
                }));
                result.addAll(rows);
            } else {
                result.addAll(this.flattenGroups(group.rows as VirtualGridGroup[], level + 1, headerRow));
            }
        }
        return new EnumerableSet<VirtualGridRow>(result);
    }

    private getGroupKey(field: string, rows: Row[]): string {
        return `${field}-${rows[0].data[field]}`;
    }

    private getNestedGroupKey(parentList: VirtualGridRow[], key: string): string {
        return `${parentList.map(p => p.groupId).join("-")}-${key}`.replaceAll(" ", "_");
    }

    private setSelectedKeysLoadSubscription(): void {
        this.gridService.selectedKeysLoad$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(selectedKeys => {
            const firstKey = selectedKeys.firstOrDefault();
            if (firstKey == null) {
                return;
            }
            if (this.gridService.groupColumns().any()) {
                const viewData = this.groupedGridRows();
                const selectedRow = viewData.firstOrDefault(
                    r => r.type === "row" && r.row.data[this.gridService.selectBy()] === firstKey
                );
                if (selectedRow != null) {
                    const index = viewData.indexOf(selectedRow);
                    window.setTimeout(() => {
                        this.viewport().scrollToIndex(index);
                    });
                }
            } else {
                const viewData = this.data().toImmutableList();
                const selectedRow = viewData.firstOrDefault(r => r.data[this.gridService.selectBy()] === firstKey);
                if (selectedRow != null) {
                    const index = viewData.indexOf(selectedRow);
                    window.setTimeout(() => {
                        this.viewport().scrollToIndex(index);
                    });
                }
            }
        });
    }

    private setSubscriptions(): void {
        this.#groupColumns$
            .pipe(startWith(this.gridService.groupColumns()), pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([prev, current]) => {
                const removedColumns = prev.where(c => !current.contains(c));
                removedColumns.forEach(c => {
                    this.collapsedGroups.update(groups => {
                        return groups.where(g => !g.includes(c.field())).toImmutableSet();
                    });
                });
            });

        /**
         * This is a workaround to force the virtual scroll to update the rendered range
         * When the data changes, the view is not rendered correctly. It is empty until the user scrolls,
         * which triggers the update of the rendered range.
         * We manually trigger the update so that grid is rendered when the grouping changes.
         * @see @angular/components issue #21793 on GitHub
         */
        this.#groupColumns$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(columns => {
            const reRender = (): void => {
                const renderedRange = this.viewport().getRenderedRange();
                this.viewport().setRenderedRange({
                    start: renderedRange.start,
                    end: renderedRange.end + 1
                });
            };
            if (columns.any()) {
                reRender();
            } else {
                afterNextRender(() => reRender(), { injector: this.#injector });
            }
        });
        this.setSelectedKeysLoadSubscription();
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
