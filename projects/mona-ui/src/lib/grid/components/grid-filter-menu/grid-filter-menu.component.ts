import { animate, AnimationBuilder, style } from "@angular/animations";
import { NgClass } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFilter, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { take } from "rxjs";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { FilterMenuComponent } from "../../../filter/components/filter-menu/filter-menu.component";
import { DataType } from "../../../models/DataType";
import { PopupRef } from "../../../popup/models/PopupRef";
import { PopupService } from "../../../popup/services/popup.service";
import { Column } from "../../models/Column";
import { ColumnFilterState } from "../../models/ColumnFilterState";
import { GridService } from "../../services/grid.service";

@Component({
    selector: "mona-grid-filter-menu",
    templateUrl: "./grid-filter-menu.component.html",
    styleUrls: ["./grid-filter-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ButtonDirective, NgClass, FontAwesomeModule]
})
export class GridFilterMenuComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private popupRef?: PopupRef;
    public readonly filterIcon: IconDefinition = faFilter;

    @Input()
    public column!: Column;

    @Output()
    public apply: EventEmitter<ColumnFilterState> = new EventEmitter<ColumnFilterState>();

    @Input()
    public type: DataType = "string";

    public constructor(
        private readonly animationBuilder: AnimationBuilder,
        private readonly cdr: ChangeDetectorRef,
        private readonly popupService: PopupService,
        private readonly elementRef: ElementRef,
        private readonly gridService: GridService
    ) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public openPopup(): void {
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: FilterMenuComponent,
            popupClass: "mona-grid-filter-menu-popup-content",
            closeOnBackdropClick: false,
            hasBackdrop: true,
            preventClose: event => {
                if (event.originalEvent instanceof MouseEvent) {
                    const target = event.originalEvent.target as HTMLElement;
                    if (target.closest(".mona-popup-content")) {
                        return true;
                    }
                }
                return false;
            }
        });
        this.popupRef.overlayRef
            .backdropClick()
            .pipe(take(1))
            .subscribe(() => {
                this.animateLeave();
                this.popupRef?.closeWithDelay(100);
            });

        this.animateEnter();
        const filterState = this.gridService.appliedFilters.get(this.column.field);
        const componentRef = this.popupRef.component as ComponentRef<FilterMenuComponent>;
        componentRef.instance.type.set(this.type);
        componentRef.instance.field.set(this.column.field);
        if (filterState?.filterMenuValue) {
            componentRef.instance.value = filterState.filterMenuValue;
        }
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.apply.pipe(take(1)).subscribe(filter => {
            const filterState: ColumnFilterState = {
                filter,
                filterMenuValue: componentRef.instance.value
            };
            this.animateLeave();
            this.popupRef?.closeWithDelay(100);
            this.apply.emit(filterState);
        });
    }

    private animateEnter(): void {
        if (this.popupRef?.overlayRef?.overlayElement?.parentElement) {
            this.popupRef.overlayRef.overlayElement.parentElement.style.overflow = "hidden";
        }
        this.animationBuilder
            .build([
                style({ transform: "translateY(-100%)", opacity: 1 }),
                animate("0.15s ease-out", style({ transform: "translateY(0)", opacity: 1 }))
            ])
            .create(this.popupRef?.overlayRef?.overlayElement)
            .play();
    }

    private animateLeave(): void {
        if (this.popupRef?.overlayRef?.overlayElement?.parentElement) {
            this.popupRef.overlayRef.overlayElement.parentElement.style.overflow = "hidden";
        }
        this.animationBuilder
            .build([
                style({ transform: "translateY(0)", opacity: 1 }),
                animate("0.15s ease-out", style({ transform: "translateY(-100%)", opacity: 1 }))
            ])
            .create(this.popupRef?.overlayRef?.overlayElement)
            .play();
    }

    private setSubscriptions(): void {
        this.gridService.filterLoad$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.cdr.detectChanges();
        });
    }
}
