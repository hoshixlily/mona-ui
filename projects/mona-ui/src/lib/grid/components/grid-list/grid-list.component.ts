import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    untracked
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Dictionary, ImmutableList, ImmutableSet } from "@mirei/ts-collections";
import { fromEvent, mergeWith } from "rxjs";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { ElementAtPipe } from "../../../pipes/element-at.pipe";
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
        GridGroupPipe,
        ElementAtPipe
    ],
    host: {
        class: "mona-grid-list"
    }
})
export class GridListComponent implements OnInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #hostElementRef = inject(ElementRef<HTMLDivElement>);
    protected readonly collapseIcon = faChevronDown;
    protected readonly expandIcon = faChevronRight;
    protected readonly gridService = inject(GridService);

    public columns = input<ImmutableList<Column>>(ImmutableList.create());
    public data = input<ImmutableSet<Row>>(ImmutableSet.create());

    public constructor() {
        effect(() => untracked(() => this.synchronizeHorizontalScroll()));
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onGridRowClick(event: MouseEvent, row: Row): void {
        this.gridService.handleRowClick(event, row);
    }

    public onGroupExpandChange(group: GridGroup): void {
        group.collapsed = !group.collapsed;
        const groupKey = `${group.column.field()}-${group.rows[0].data[group.column.field()]}`;
        const state = this.gridService.gridGroupExpandState.get(groupKey);
        if (state == null) {
            this.gridService.gridGroupExpandState.add(
                groupKey,
                new Dictionary<number, boolean>([[this.gridService.pageState.page(), group.collapsed]])
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
        const headerElement = this.gridService.gridHeaderElement();
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
