import { animate, AnimationBuilder, style } from "@angular/animations";
import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, ComponentRef, ElementRef, inject, input, output } from "@angular/core";
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
    imports: [ButtonDirective, NgClass],
    host: {
        class: "mona-grid-filter-menu"
    }
})
export class GridFilterMenuComponent {
    readonly #animationBuilder = inject(AnimationBuilder);
    readonly #gridService = inject(GridService);
    readonly #hostElementRef = inject(ElementRef<HTMLElement>);
    readonly #popupService = inject(PopupService);
    #popupRef?: PopupRef;

    public readonly apply = output<ColumnFilterState>();

    public column = input.required<Column>();
    public type = input<DataType>("string");

    public openPopup(): void {
        this.#popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
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
        this.#popupRef.overlayRef
            .backdropClick()
            .pipe(take(1))
            .subscribe(() => {
                this.animateLeave();
                this.#popupRef?.closeWithDelay(100);
            });

        this.animateEnter();
        const filterState = this.#gridService.appliedFilters().get(this.column().field());
        const componentRef = this.#popupRef.component as ComponentRef<FilterMenuComponent>;
        componentRef.instance.type.set(this.type());
        componentRef.instance.field.set(this.column().field());
        if (filterState?.filterMenuValue) {
            componentRef.instance.value.set(filterState.filterMenuValue);
        }
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.apply.subscribe(filter => {
            const filterState: ColumnFilterState = {
                filter,
                filterMenuValue: componentRef.instance.getFilterValues()
            };
            this.animateLeave();
            this.#popupRef?.closeWithDelay(100);
            this.apply.emit(filterState);
        });
    }

    private animateEnter(): void {
        if (this.#popupRef?.overlayRef?.overlayElement?.parentElement) {
            this.#popupRef.overlayRef.overlayElement.parentElement.style.overflow = "hidden";
        }
        this.#animationBuilder
            .build([
                style({ transform: "translateY(-100%)", opacity: 1 }),
                animate("0.15s ease-out", style({ transform: "translateY(0)", opacity: 1 }))
            ])
            .create(this.#popupRef?.overlayRef?.overlayElement)
            .play();
    }

    private animateLeave(): void {
        if (this.#popupRef?.overlayRef?.overlayElement?.parentElement) {
            this.#popupRef.overlayRef.overlayElement.parentElement.style.overflow = "hidden";
        }
        this.#animationBuilder
            .build([
                style({ transform: "translateY(0)", opacity: 1 }),
                animate("0.15s ease-out", style({ transform: "translateY(-100%)", opacity: 1 }))
            ])
            .create(this.#popupRef?.overlayRef?.overlayElement)
            .play();
    }
}
