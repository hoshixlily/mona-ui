import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { GridService } from "../../services/grid.service";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { faChevronDown, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GridGroup } from "../../models/GridGroup";
import { Dictionary, KeyValuePair } from "@mirei/ts-collections";

@Component({
    selector: "mona-grid-list",
    templateUrl: "./grid-list.component.html",
    styleUrls: ["./grid-list.component.scss"]
})
export class GridListComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
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
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {}

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

    private synchronizeHorizontalScroll(): void {
        const headerElement = this.gridService.gridHeaderElement;
        const gridElement = this.elementRef.nativeElement.querySelector(".mona-grid-list") as HTMLDivElement;
        if (headerElement == null || gridElement == null) {
            return;
        }
        fromEvent(gridElement, "scroll")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
                headerElement.scrollLeft = gridElement.scrollLeft;
            });
    }
}
