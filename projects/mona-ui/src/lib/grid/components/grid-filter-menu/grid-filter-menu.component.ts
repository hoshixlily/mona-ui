import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    ElementRef,
    Input,
    OnInit
} from "@angular/core";
import { PopupService } from "../../../popup/services/popup.service";
import { PopupRef } from "../../../popup/models/PopupRef";
import { FilterMenuComponent } from "../../../filter/components/filter-menu/filter-menu.component";
import { FilterFieldType } from "../../../filter/models/FilterFieldType";
import { faFilter, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GridService } from "../../services/grid.service";

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
    public field: string = "";

    @Input()
    public type: FilterFieldType = "string";
    public constructor(
        private readonly popupService: PopupService,
        private readonly elementRef: ElementRef,
        private readonly gridService: GridService,
        private readonly cdr: ChangeDetectorRef
    ) {}
    public ngOnInit(): void {}

    public openPopup(): void {
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: FilterMenuComponent,
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
        const filterState = this.gridService.appliedFilters.get(this.field);
        const componentRef = this.popupRef.component as ComponentRef<FilterMenuComponent>;
        componentRef.instance.type = this.type;
        componentRef.instance.field = this.field;
        if (filterState?.filterMenuValue) {
            componentRef.instance.value = filterState.filterMenuValue;
        }
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.apply.pipe().subscribe(filter => {
            console.log(filter);
            if (filter.filters.length > 0) {
                this.gridService.appliedFilters.put(this.field, {
                    filter,
                    filterMenuValue: componentRef.instance.value
                });
            } else {
                this.gridService.appliedFilters.remove(this.field);
            }
            this.gridService.appliedFilters = this.gridService.appliedFilters.toDictionary(
                p => p.key,
                p => p.value
            );
            this.popupRef?.close();
            this.cdr.detectChanges();
        });
    }
}
