import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupListService } from "../../../../services/popup-list.service";
import { debounceTime, distinctUntilChanged, fromEvent, Subject, take, takeUntil } from "rxjs";
import { ComboBoxGroupTemplateDirective } from "../../../combo-box/directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../../combo-box/directives/combo-box-item-template.directive";
import { Group } from "@mirei/ts-collections";
import * as i0 from "@angular/core";
import * as i1 from "../../../../services/popup-list.service";
import * as i2 from "../../../../../popup/services/popup.service";
import * as i3 from "@angular/common";
import * as i4 from "../../../../../inputs/modules/text-box/components/text-box/text-box.component";
import * as i5 from "@angular/forms";
import * as i6 from "../../../../../buttons/modules/button/directives/button.directive";
import * as i7 from "@fortawesome/angular-fontawesome";
import * as i8 from "../../../../components/popup-list/popup-list.component";
import * as i9 from "../../../../directives/list-item-template.directive";
import * as i10 from "../../../../directives/list-group-template.directive";
export class AutoCompleteComponent extends AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        super(elementRef, popupListService, popupService);
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.navigateWhileClosed = false;
        this.selectionMode = "single";
        this.autoCompleteValue$ = new Subject();
        this.autoCompleteValue = "";
        this.filterable = false;
        this.valueChange = new EventEmitter();
    }
    clearValue(event) {
        event.stopImmediatePropagation();
        this.popupListService.sourceListData
            .selectMany(g => g.source)
            .forEach(i => (i.selected = i.highlighted = false));
        this.autoCompleteValue = "";
        this.value = "";
        this.valueChange.emit("");
    }
    ngOnInit() {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.autoCompleteValue = this.value ?? "";
    }
    onKeydown(event) {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.selected || i.highlighted);
            if (item) {
                this.valuePopupListItem = item;
                this.autoCompleteValue = item.text;
                if (this.value !== item.text) {
                    this.value = item.text;
                    this.valueChange.emit(item.text);
                }
            }
            else {
                if (this.value !== this.autoCompleteValue) {
                    this.value = this.autoCompleteValue;
                    this.valuePopupListItem = undefined;
                    this.valueChange.emit(this.autoCompleteValue);
                }
            }
            this.close();
        }
        else if (event.key === "Escape") {
            this.close();
        }
    }
    onPopupListValueChange(event) {
        if (event?.via === "navigation") {
            return;
        }
        if (!event.value || event.value.length === 0) {
            this.value = "";
            this.valuePopupListItem = undefined;
            this.autoCompleteValue = "";
            this.valueChange.emit(this.autoCompleteValue);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.value = event.value[0].text;
            this.valuePopupListItem = event.value[0];
            this.autoCompleteValue = event.value[0].text;
            this.valueChange.emit(event.value[0].text);
            this.close();
        }
    }
    open(options = {}) {
        this.popupRef = super.open(options);
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
            }
        });
        return this.popupRef;
    }
    setEventListeners() {
        fromEvent(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        fromEvent(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => {
            const target = event.relatedTarget;
            if (!(target &&
                (this.elementRef.nativeElement.contains(target) ||
                    this.popupRef?.overlayRef.overlayElement.contains(target)))) {
                if (this.value !== this.autoCompleteValue) {
                    this.value = this.autoCompleteValue;
                    this.valueChange.emit(this.autoCompleteValue);
                }
                this.valuePopupListItem = undefined;
            }
        });
    }
    setSubscriptions() {
        this.autoCompleteValue$
            .pipe(takeUntil(this.componentDestroy$), debounceTime(50), distinctUntilChanged())
            .subscribe((value) => {
            if (value) {
                if (this.filterable) {
                    this.popupListService.viewListData = this.popupListService.sourceListData
                        .select(g => {
                        const filteredItems = g.source.where(i => i.text.toLowerCase().startsWith(value.toLowerCase()));
                        return new Group(g.key, filteredItems.toList());
                    })
                        .toList();
                    this.popupListService.filterModeActive = true;
                }
                this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .forEach(i => (i.selected = i.highlighted = false));
                const popupListItem = this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .firstOrDefault(item => !item.disabled && item.text.toLowerCase().startsWith(value.toLowerCase()));
                if (popupListItem) {
                    popupListItem.highlighted = true;
                    this.popupListService.scrollToListItem$.next(popupListItem);
                }
                if (!this.popupRef) {
                    this.open();
                }
                this.autoCompleteValue = value;
            }
            else {
                this.close();
                this.autoCompleteValue = value;
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteComponent, deps: [{ token: i0.ElementRef }, { token: i1.PopupListService }, { token: i2.PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AutoCompleteComponent, selector: "mona-auto-complete", inputs: { filterable: "filterable", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [PopupListService], queries: [{ propertyName: "groupTemplate", first: true, predicate: ComboBoxGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: ComboBoxItemTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-dropdown mona-auto-complete mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"autoCompleteValue\" (ngModelChange)=\"autoCompleteValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && value\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i4.TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i6.ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i7.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "component", type: i8.PopupListComponent, selector: "mona-popup-list", inputs: ["filterable", "groupField", "highlightedValues", "navigable", "selectionMode", "textField", "value", "valueField"], outputs: ["valueChange"] }, { kind: "directive", type: i9.ListItemTemplateDirective, selector: "ng-template[monaListItemTemplate]" }, { kind: "directive", type: i10.ListGroupTemplateDirective, selector: "ng-template[monaListGroupTemplate]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-auto-complete", providers: [PopupListService], template: "<div class=\"mona-dropdown mona-auto-complete mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"autoCompleteValue\" (ngModelChange)=\"autoCompleteValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && value\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.PopupListService }, { type: i2.PopupService }]; }, propDecorators: { filterable: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [ComboBoxGroupTemplateDirective, { read: TemplateRef }]
            }], itemTemplate: [{
                type: ContentChild,
                args: [ComboBoxItemTemplateDirective, { read: TemplateRef }]
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZHJvcGRvd25zL21vZHVsZXMvYXV0by1jb21wbGV0ZS9jb21wb25lbnRzL2F1dG8tY29tcGxldGUvYXV0by1jb21wbGV0ZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZHJvcGRvd25zL21vZHVsZXMvYXV0by1jb21wbGV0ZS9jb21wb25lbnRzL2F1dG8tY29tcGxldGUvYXV0by1jb21wbGV0ZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEgsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDakksT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFHM0UsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFL0YsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDbEgsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFJaEgsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7Ozs7Ozs7QUFROUMsTUFBTSxPQUFPLHFCQUFzQixTQUFRLDZCQUE2QjtJQXNCcEUsWUFDZ0MsVUFBbUMsRUFDbkMsZ0JBQWtDLEVBQ2xDLFlBQTBCO1FBRXRELEtBQUssQ0FBQyxVQUFVLEVBQUUs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SUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDL0Q7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZjtnQkFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO2FBQ2xDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO2FBQ2xDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDOzhHQXZMUSxxQkFBcUI7a0dBQXJCLHFCQUFxQiw0SUFGbkIsQ0FBQyxnQkFBZ0IsQ0FBQyxxRUFZZiw4QkFBOEIsMkJBQVUsV0FBVyw0REFHbkQsNkJBQTZCLDJCQUFVLFdBQVcsb0RDakNwRSxrdERBNEJBOzsyRkRSYSxxQkFBcUI7a0JBTmpDLFNBQVM7K0JBQ0ksb0JBQW9CLGFBR25CLENBQUMsZ0JBQWdCLENBQUM7MkpBVXRCLFVBQVU7c0JBRGhCLEtBQUs7Z0JBSUMsYUFBYTtzQkFEbkIsWUFBWTt1QkFBQyw4QkFBOEIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBSTVELFlBQVk7c0JBRGxCLFlBQVk7dUJBQUMsNkJBQTZCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUlsRCxLQUFLO3NCQURwQixLQUFLO2dCQUlVLFdBQVc7c0JBRDFCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFic3RyYWN0RHJvcERvd25MaXN0Q29tcG9uZW50IH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NvbXBvbmVudHMvYWJzdHJhY3QtZHJvcC1kb3duLWxpc3QvYWJzdHJhY3QtZHJvcC1kb3duLWxpc3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBQb3B1cExpc3RTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZpY2VzL3BvcHVwLWxpc3Quc2VydmljZVwiO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3BvcHVwL3NlcnZpY2VzL3BvcHVwLnNlcnZpY2VcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vbW9kZWxzL1NlbGVjdGlvbk1vZGVcIjtcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGZyb21FdmVudCwgU3ViamVjdCwgdGFrZSwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IFBvcHVwTGlzdEl0ZW0gfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGF0YS9Qb3B1cExpc3RJdGVtXCI7XG5pbXBvcnQgeyBDb21ib0JveEdyb3VwVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vLi4vY29tYm8tYm94L2RpcmVjdGl2ZXMvY29tYm8tYm94LWdyb3VwLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgQ29tYm9Cb3hJdGVtVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vLi4vY29tYm8tYm94L2RpcmVjdGl2ZXMvY29tYm8tYm94LWl0ZW0tdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBQb3B1cExpc3RWYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSBcIi4uLy4uLy4uLy4uL2RhdGEvUG9wdXBMaXN0VmFsdWVDaGFuZ2VFdmVudFwiO1xuaW1wb3J0IHsgUG9wdXBSZWYgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwUmVmXCI7XG5pbXBvcnQgeyBQb3B1cFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3BvcHVwL21vZGVscy9Qb3B1cFNldHRpbmdzXCI7XG5pbXBvcnQgeyBHcm91cCB9IGZyb20gXCJAbWlyZWkvdHMtY29sbGVjdGlvbnNcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1hdXRvLWNvbXBsZXRlXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9hdXRvLWNvbXBsZXRlLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2F1dG8tY29tcGxldGUuY29tcG9uZW50LnNjc3NcIl0sXG4gICAgcHJvdmlkZXJzOiBbUG9wdXBMaXN0U2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlQ29tcG9uZW50IGV4dGVuZHMgQWJzdHJhY3REcm9wRG93bkxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByb3RlY3RlZCBvdmVycmlkZSBuYXZpZ2F0ZVdoaWxlQ2xvc2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIHNlbGVjdGlvbk1vZGU6IFNlbGVjdGlvbk1vZGUgPSBcInNpbmdsZVwiO1xuICAgIHB1YmxpYyByZWFkb25seSBhdXRvQ29tcGxldGVWYWx1ZSQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICBwdWJsaWMgYXV0b0NvbXBsZXRlVmFsdWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIG92ZXJyaWRlIHZhbHVlUG9wdXBMaXN0SXRlbT86IFBvcHVwTGlzdEl0ZW07XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmaWx0ZXJhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAQ29udGVudENoaWxkKENvbWJvQm94R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBncm91cFRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoQ29tYm9Cb3hJdGVtVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgaXRlbVRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG92ZXJyaWRlIHZhbHVlPzogc3RyaW5nO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG92ZXJyaWRlIHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHByb3RlY3RlZCBvdmVycmlkZSByZWFkb25seSBwb3B1cExpc3RTZXJ2aWNlOiBQb3B1cExpc3RTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVhZG9ubHkgcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudFJlZiwgcG9wdXBMaXN0U2VydmljZSwgcG9wdXBTZXJ2aWNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJWYWx1ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnNvdXJjZUxpc3REYXRhXG4gICAgICAgICAgICAuc2VsZWN0TWFueShnID0+IGcuc291cmNlKVxuICAgICAgICAgICAgLmZvckVhY2goaSA9PiAoaS5zZWxlY3RlZCA9IGkuaGlnaGxpZ2h0ZWQgPSBmYWxzZSkpO1xuICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZVZhbHVlID0gXCJcIjtcbiAgICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChcIlwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5zZXRTdWJzY3JpcHRpb25zKCk7XG4gICAgICAgIHRoaXMuYXV0b0NvbXBsZXRlVmFsdWUgPSB0aGlzLnZhbHVlID8/IFwiXCI7XG4gICAgfVxuXG4gICAgcHVibGljIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uudmlld0xpc3REYXRhXG4gICAgICAgICAgICAgICAgLnNlbGVjdE1hbnkoZyA9PiBnLnNvdXJjZSlcbiAgICAgICAgICAgICAgICAuZmlyc3RPckRlZmF1bHQoaSA9PiBpLnNlbGVjdGVkIHx8IGkuaGlnaGxpZ2h0ZWQpO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlUG9wdXBMaXN0SXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvQ29tcGxldGVWYWx1ZSA9IGl0ZW0udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gaXRlbS50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBpdGVtLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChpdGVtLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IHRoaXMuYXV0b0NvbXBsZXRlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuYXV0b0NvbXBsZXRlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVQb3B1cExpc3RJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5hdXRvQ29tcGxldGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uUG9wdXBMaXN0VmFsdWVDaGFuZ2UoZXZlbnQ6IFBvcHVwTGlzdFZhbHVlQ2hhbmdlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50Py52aWEgPT09IFwibmF2aWdhdGlvblwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFldmVudC52YWx1ZSB8fCBldmVudC52YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy52YWx1ZVBvcHVwTGlzdEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZVZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLmF1dG9Db21wbGV0ZVZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiBldmVudC52YWx1ZVswXS5kYXRhRXF1YWxzKHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudmlhID09PSBcInNlbGVjdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC52aWEgPT09IFwic2VsZWN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBldmVudC52YWx1ZVswXS50ZXh0O1xuICAgICAgICAgICAgdGhpcy52YWx1ZVBvcHVwTGlzdEl0ZW0gPSBldmVudC52YWx1ZVswXTtcbiAgICAgICAgICAgIHRoaXMuYXV0b0NvbXBsZXRlVmFsdWUgPSBldmVudC52YWx1ZVswXS50ZXh0O1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KGV2ZW50LnZhbHVlWzBdLnRleHQpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG92ZXJyaWRlIG9wZW4ob3B0aW9uczogUGFydGlhbDxQb3B1cFNldHRpbmdzPiA9IHt9KTogUG9wdXBSZWYge1xuICAgICAgICB0aGlzLnBvcHVwUmVmID0gc3VwZXIub3BlbihvcHRpb25zKTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKC0xLCAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBvcHVwUmVmLmNsb3NlZC5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5wb3B1cFJlZjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwiZm9jdXNpblwiKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKC0xLCAtMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGZyb21FdmVudDxGb2N1c0V2ZW50Pih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgXCJmb2N1c291dFwiKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICEoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyh0YXJnZXQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cFJlZj8ub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jb250YWlucyh0YXJnZXQpKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSB0aGlzLmF1dG9Db21wbGV0ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5hdXRvQ29tcGxldGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLmF1dG9Db21wbGV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlUG9wdXBMaXN0SXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFN1YnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXV0b0NvbXBsZXRlVmFsdWUkXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCksIGRlYm91bmNlVGltZSg1MCksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGEgPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uuc291cmNlTGlzdERhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2VsZWN0KGcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gZy5zb3VyY2Uud2hlcmUoaSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaS50ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCh2YWx1ZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwPHN0cmluZywgUG9wdXBMaXN0SXRlbT4oZy5rZXksIGZpbHRlcmVkSXRlbXMudG9MaXN0KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLmZpbHRlck1vZGVBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChpID0+IChpLnNlbGVjdGVkID0gaS5oaWdobGlnaHRlZCA9IGZhbHNlKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcHVwTGlzdEl0ZW0gPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uudmlld0xpc3REYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2VsZWN0TWFueShnID0+IGcuc291cmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0T3JEZWZhdWx0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPT4gIWl0ZW0uZGlzYWJsZWQgJiYgaXRlbS50ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCh2YWx1ZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcHVwTGlzdEl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwTGlzdEl0ZW0uaGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnNjcm9sbFRvTGlzdEl0ZW0kLm5leHQocG9wdXBMaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBvcHVwUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZVZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZVZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1vbmEtZHJvcGRvd24gbW9uYS1hdXRvLWNvbXBsZXRlIG1vbmEtaW5wdXQtc2VsZWN0b3JcIiBbbmdDbGFzc109XCJ7J21vbmEtZGlzYWJsZWQnOiBkaXNhYmxlZH1cIiBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IC0xIDogMFwiICNkcm9wZG93bldyYXBwZXI+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtaW5wdXQtc2VsZWN0b3ItdmFsdWVcIj5cbiAgICAgICAgPG1vbmEtdGV4dC1ib3ggW25nTW9kZWxdPVwiYXV0b0NvbXBsZXRlVmFsdWVcIiAobmdNb2RlbENoYW5nZSk9XCJhdXRvQ29tcGxldGVWYWx1ZSQubmV4dCgkZXZlbnQpXCIgKGtleWRvd24pPVwib25LZXlkb3duKCRldmVudClcIj48L21vbmEtdGV4dC1ib3g+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtaW5wdXQtc2VsZWN0b3ItaWNvblwiICpuZ0lmPVwic2hvd0NsZWFyQnV0dG9uICYmIHZhbHVlXCI+XG4gICAgICAgIDxidXR0b24gbW9uYUJ1dHRvbiBbZmxhdF09XCJ0cnVlXCIgKGNsaWNrKT1cImNsZWFyVmFsdWUoJGV2ZW50KVwiIGNsYXNzPVwibW9uYS1kcm9wZG93bi1jbGVhci1pY29uXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgPGZhLWljb24gW2ljb25dPVwiY2xlYXJJY29uXCI+PC9mYS1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI3BvcHVwVGVtcGxhdGU+XG4gICAgPGRpdiAqbmdJZj1cIiEhcG9wdXBSZWZcIj5cbiAgICAgICAgPG1vbmEtcG9wdXAtbGlzdCBbdGV4dEZpZWxkXT1cInRleHRGaWVsZFwiIFt2YWx1ZUZpZWxkXT1cInZhbHVlRmllbGRcIiBbZ3JvdXBGaWVsZF09XCJncm91cEZpZWxkXCIgW3ZhbHVlXT1cInZhbHVlID8gW3ZhbHVlXSA6IFtdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25Qb3B1cExpc3RWYWx1ZUNoYW5nZSgkZXZlbnQpXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbVRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG1vbmFMaXN0SXRlbVRlbXBsYXRlIGxldC1kYXRhSXRlbSBsZXQtbGlzdEl0ZW09XCJsaXN0SXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW1UZW1wbGF0ZSA/PyBudWxsXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGRhdGFJdGVtLCBsaXN0SXRlbX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZ3JvdXBUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBtb25hTGlzdEdyb3VwVGVtcGxhdGUgbGV0LWRhdGFJdGVtIGxldC1saXN0SXRlbT1cImxpc3RJdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZ3JvdXBUZW1wbGF0ZSA/PyBudWxsXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGRhdGFJdGVtLCBsaXN0SXRlbX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbW9uYS1wb3B1cC1saXN0PlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==