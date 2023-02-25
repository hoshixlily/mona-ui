import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { GridService } from "../../services/grid.service";
import { faChevronDown, faChevronUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Column } from "../../models/Column";
import { SortDescriptor } from "../../../query/sort/SortDescriptor";
import { CompositeFilterDescriptor } from "../../../query/filter/FilterDescriptor";
import { ColumnFilterState } from "../../models/ColumnFilterState";

@Component({
    selector: "mona-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GridService]
})
export class GridComponent implements OnInit, AfterViewInit {
    public readonly ascendingSortIcon: IconDefinition = faChevronDown;
    public readonly descendingSortIcon: IconDefinition = faChevronUp;

    @ViewChild("gridHeaderElement")
    public set gridHeaderElement(value: ElementRef<HTMLDivElement>) {
        this.gridService.gridHeaderElement = value.nativeElement;
        window.setTimeout(() => this.setInitialCalculatedWidthOfColumns());
    }

    @Input()
    public resizable: boolean = true;

    public constructor(public readonly gridService: GridService) {}

    public ngAfterViewInit(): void {}

    public ngOnInit(): void {}

    public onColumnFilter(column: Column, state: ColumnFilterState): void {
        console.log("onColumnFilter", column, state);
        if (state.filter && state.filter.filters.length > 0) {
            this.gridService.appliedFilters.put(column.field, state);
            column.filtered = true;
        } else {
            this.gridService.appliedFilters.remove(column.field);
            column.filtered = false;
        }
        this.gridService.appliedFilters = this.gridService.appliedFilters.toDictionary(
            p => p.key,
            p => p.value
        );
    }

    public onColumnSort(column: Column): void {
        if (column.sortDirection == null) {
            column.sortDirection = "asc";
        } else if (column.sortDirection === "asc") {
            column.sortDirection = "desc";
        } else {
            column.sortDirection = undefined;
        }
        if (column.sortDirection != null) {
            const sortDescriptor: SortDescriptor = {
                field: column.field,
                dir: column.sortDirection
            };
            this.gridService.appliedSorts.put(column.field, { sort: sortDescriptor });
        } else {
            this.gridService.appliedSorts.remove(column.field);
        }
        this.gridService.appliedSorts = this.gridService.appliedSorts.toDictionary(
            p => p.key,
            p => p.value
        );
    }

    private setInitialCalculatedWidthOfColumns(): void {
        if (this.gridService.gridHeaderElement) {
            const thList = this.gridService.gridHeaderElement?.querySelectorAll("th");
            for (const [cx, column] of Array.from(thList).entries()) {
                this.gridService.columns[cx].calculatedWidth = column.offsetWidth;
            }
        }
    }

    public get headerMargin(): string {
        return `0 12px 0 0`;
    }
}
