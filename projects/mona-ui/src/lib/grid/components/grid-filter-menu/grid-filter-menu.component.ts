import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import { PopupService } from "../../../popup/services/popup.service";
import { PopupRef } from "../../../popup/models/PopupRef";
import { FilterMenuComponent } from "../../../filter/components/filter-menu/filter-menu.component";
import { FilterFieldType } from "../../../filter/models/FilterFieldType";
import { faFilter, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GridService } from "../../services/grid.service";
import { ColumnFilterState } from "../../models/ColumnFilterState";
import { Column } from "../../models/Column";

@Component({
    selector: "mona-grid-filter-menu",
    templateUrl: "./grid-filter-menu.component.html",
    styleUrls: ["./grid-filter-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridFilterMenuComponent implements OnInit {
    private popupRef?: PopupRef;
    public readonly filterIcon: IconDefinition = faFilter;

    @Input()
    public column!: Column;

    @Output()
    public apply: EventEmitter<ColumnFilterState> = new EventEmitter<ColumnFilterState>();

    @Input()
    public type: FilterFieldType = "string";
    public constructor(
        private readonly popupService: PopupService,
        private readonly elementRef: ElementRef,
        private readonly gridService: GridService
    ) {}
    public ngOnInit(): void {}

    public openPopup(): void {
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: FilterMenuComponent,
            popupClass: "mona-grid-filter-menu-popup-content",
            preventClose: event => {
                if (event.originalEvent instanceof PointerEvent) {
                    const target = event.originalEvent.target as HTMLElement;
                    if (target.closest(".mona-popup-content")) {
                        return true;
                    }
                }
                return false;
            }
        });
        const filterState = this.gridService.appliedFilters.get(this.column.field);
        const componentRef = this.popupRef.component as ComponentRef<FilterMenuComponent>;
        componentRef.instance.type = this.type;
        componentRef.instance.field = this.column.field;
        if (filterState?.filterMenuValue) {
            componentRef.instance.value = filterState.filterMenuValue;
        }
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.apply.pipe().subscribe(filter => {
            const filterState: ColumnFilterState = {
                filter,
                filterMenuValue: componentRef.instance.value
            };
            this.popupRef?.close();
            this.apply.emit(filterState);
        });
    }
}
