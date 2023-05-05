import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupListService } from "../../../../services/popup-list.service";
import { distinctUntilChanged, fromEvent, map, of, Subject, take, takeUntil } from "rxjs";
import { Group } from "@mirei/ts-collections";
import { ComboBoxGroupTemplateDirective } from "../../directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../directives/combo-box-item-template.directive";
import * as i0 from "@angular/core";
import * as i1 from "../../../../services/popup-list.service";
import * as i2 from "../../../../../popup/services/popup.service";
import * as i3 from "@angular/common";
import * as i4 from "@fortawesome/angular-fontawesome";
import * as i5 from "../../../../../buttons/modules/button/directives/button.directive";
import * as i6 from "../../../../components/popup-list/popup-list.component";
import * as i7 from "../../../../directives/list-item-template.directive";
import * as i8 from "../../../../directives/list-group-template.directive";
import * as i9 from "../../../../../inputs/modules/text-box/components/text-box/text-box.component";
import * as i10 from "@angular/forms";
export class ComboBoxComponent extends AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        super(elementRef, popupListService, popupService);
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.selectionMode = "single";
        this.comboBoxValue$ = new Subject();
        this.comboBoxValue = "";
        this.allowCustomValue = true;
        this.filterable = false;
        this.valueChange = new EventEmitter();
        this.valueNormalizer = (text$) => text$.pipe(map(value => value));
    }
    clearValue(event) {
        event.stopImmediatePropagation();
        this.comboBoxValue = "";
        this.updateValue(undefined);
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.comboBoxValue = this.valuePopupListItem?.text ?? "";
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.comboBoxValue = this.valuePopupListItem?.text ?? "";
    }
    onKeydown(event) {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
            if (item) {
                this.popupListService.selectItem(item, this.selectionMode);
                this.updateValue(item);
            }
            else {
                if (this.allowCustomValue) {
                    this.valueNormalizer(of(this.comboBoxValue)).subscribe(normalizedValue => {
                        this.data = [...this.data, normalizedValue];
                        this.popupListService.initializeListData({
                            data: [...this.data],
                            valueField: this.valueField,
                            disabler: this.itemDisabler,
                            textField: this.textField,
                            groupField: this.groupField
                        });
                        const item = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
                        if (item) {
                            this.popupListService.selectItem(item, this.selectionMode);
                            this.updateValue(item);
                        }
                    });
                }
                else {
                    this.comboBoxValue = "";
                }
            }
        }
        else if (event.key === "Escape") {
            this.close();
        }
    }
    onPopupListValueChange(event) {
        if (!event.value || event.value.length === 0) {
            this.comboBoxValue = "";
            this.updateValue(undefined);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.close();
        }
        this.updateValue(event.value[0]);
    }
    open(options = {}) {
        this.popupRef = super.open({
            ...options,
            hasBackdrop: false,
            closeOnOutsideClick: false
        });
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.popupRef?.closed.pipe(take(1)).subscribe(() => {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
            if (!item) {
                this.comboBoxValue = "";
            }
        });
        return this.popupRef;
    }
    updateValue(listItem) {
        super.updateValue(listItem);
        this.comboBoxValue = listItem?.text ?? "";
    }
    setEventListeners() {
        fromEvent(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => {
            const target = event.relatedTarget;
            if (target &&
                (this.elementRef.nativeElement.contains(target) ||
                    this.popupRef?.overlayRef.overlayElement.contains(target))) {
                return;
            }
            this.close();
        });
        fromEvent(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
    }
    setSubscriptions() {
        this.comboBoxValue$.pipe(takeUntil(this.componentDestroy$), distinctUntilChanged()).subscribe(value => {
            if (this.filterable) {
                if (!value) {
                    this.popupListService.viewListData = this.popupListService.sourceListData.toList();
                    this.popupListService.filterModeActive = false;
                }
                else {
                    this.popupListService.viewListData = this.popupListService.sourceListData
                        .select(g => {
                        const filteredItems = g.source.where(i => i.text.toLowerCase().includes(value.toLowerCase()));
                        return new Group(g.key, filteredItems.toList());
                    })
                        .toList();
                    this.popupListService.filterModeActive = true;
                }
            }
            this.popupListService.viewListData
                .selectMany(g => g.source)
                .forEach(i => (i.selected = i.highlighted = false));
            const popupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(item => !item.disabled && item.text.toLowerCase().includes(value.toLowerCase()));
            if (!this.popupRef) {
                this.open();
            }
            if (popupListItem) {
                popupListItem.highlighted = true;
                this.popupListService.scrollToListItem$.next(popupListItem);
            }
            this.comboBoxValue = value;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxComponent, deps: [{ token: i0.ElementRef }, { token: i1.PopupListService }, { token: i2.PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ComboBoxComponent, selector: "mona-combo-box", inputs: { allowCustomValue: "allowCustomValue", filterable: "filterable", value: "value", valueNormalizer: "valueNormalizer" }, outputs: { valueChange: "valueChange" }, providers: [PopupListService], queries: [{ propertyName: "groupTemplate", first: true, predicate: ComboBoxGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: ComboBoxItemTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-dropdown mona-combo-box mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"comboBoxValue\" (ngModelChange)=\"comboBoxValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && valuePopupListItem\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n    <div class=\"mona-input-selector-icon\" (click)=\"open()\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i4.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: i5.ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i6.PopupListComponent, selector: "mona-popup-list", inputs: ["filterable", "groupField", "highlightedValues", "navigable", "selectionMode", "textField", "value", "valueField"], outputs: ["valueChange"] }, { kind: "directive", type: i7.ListItemTemplateDirective, selector: "ng-template[monaListItemTemplate]" }, { kind: "directive", type: i8.ListGroupTemplateDirective, selector: "ng-template[monaListGroupTemplate]" }, { kind: "component", type: i9.TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i10.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i10.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-combo-box", providers: [PopupListService], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-dropdown mona-combo-box mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"comboBoxValue\" (ngModelChange)=\"comboBoxValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && valuePopupListItem\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n    <div class=\"mona-input-selector-icon\" (click)=\"open()\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.PopupListService }, { type: i2.PopupService }]; }, propDecorators: { allowCustomValue: [{
                type: Input
            }], filterable: [{
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
            }], valueNormalizer: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm8tYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kcm9wZG93bnMvbW9kdWxlcy9jb21iby1ib3gvY29tcG9uZW50cy9jb21iby1ib3gvY29tYm8tYm94LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kcm9wZG93bnMvbW9kdWxlcy9jb21iby1ib3gvY29tcG9uZW50cy9jb21iby1ib3gvY29tYm8tYm94LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFFWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFFTixXQUFXLEVBQ2QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDakksT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFNM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUc5QyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUNyRyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQzs7Ozs7Ozs7Ozs7O0FBU25HLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSw2QkFBNkI7SUE0QmhFLFlBQ2dDLFVBQW1DLEVBQ25DLGdCQUFrQyxFQUNsQyxZQUEwQjtRQUV0RCxLQUFLLENBQUMsVUFBVSxFQUFFLGdCQUFn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QUNaLHVCQUF1QixDQUFDLE1BQU07MkpBU3hDLGdCQUFnQjtzQkFEdEIsS0FBSztnQkFJQyxVQUFVO3NCQURoQixLQUFLO2dCQUlDLGFBQWE7c0JBRG5CLFlBQVk7dUJBQUMsOEJBQThCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUk1RCxZQUFZO3NCQURsQixZQUFZO3VCQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFJbEQsS0FBSztzQkFEcEIsS0FBSztnQkFJVSxXQUFXO3NCQUQxQixNQUFNO2dCQUlBLGVBQWU7c0JBRHJCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFRlbXBsYXRlUmVmXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBYnN0cmFjdERyb3BEb3duTGlzdENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi8uLi8uLi9jb21wb25lbnRzL2Fic3RyYWN0LWRyb3AtZG93bi1saXN0L2Fic3RyYWN0LWRyb3AtZG93bi1saXN0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgUG9wdXBMaXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2aWNlcy9wb3B1cC1saXN0LnNlcnZpY2VcIjtcbmltcG9ydCB7IFBvcHVwU2VydmljZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9wb3B1cC9zZXJ2aWNlcy9wb3B1cC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3B1cExpc3RJdGVtIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2RhdGEvUG9wdXBMaXN0SXRlbVwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9tb2RlbHMvU2VsZWN0aW9uTW9kZVwiO1xuaW1wb3J0IHsgUG9wdXBMaXN0VmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gXCIuLi8uLi8uLi8uLi9kYXRhL1BvcHVwTGlzdFZhbHVlQ2hhbmdlRXZlbnRcIjtcbmltcG9ydCB7IFBvcHVwU2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwU2V0dGluZ3NcIjtcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBmcm9tRXZlbnQsIG1hcCwgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QsIHRha2UsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBHcm91cCB9IGZyb20gXCJAbWlyZWkvdHMtY29sbGVjdGlvbnNcIjtcbmltcG9ydCB7IFBvcHVwUmVmIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3BvcHVwL21vZGVscy9Qb3B1cFJlZlwiO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL0FjdGlvblwiO1xuaW1wb3J0IHsgQ29tYm9Cb3hHcm91cFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvY29tYm8tYm94LWdyb3VwLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgQ29tYm9Cb3hJdGVtVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9jb21iby1ib3gtaXRlbS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1jb21iby1ib3hcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvbWJvLWJveC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21iby1ib3guY29tcG9uZW50LnNjc3NcIl0sXG4gICAgcHJvdmlkZXJzOiBbUG9wdXBMaXN0U2VydmljZV0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgQ29tYm9Cb3hDb21wb25lbnQgZXh0ZW5kcyBBYnN0cmFjdERyb3BEb3duTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJvdGVjdGVkIHNlbGVjdGlvbk1vZGU6IFNlbGVjdGlvbk1vZGUgPSBcInNpbmdsZVwiO1xuICAgIHB1YmxpYyByZWFkb25seSBjb21ib0JveFZhbHVlJDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgIHB1YmxpYyBjb21ib0JveFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBvdmVycmlkZSB2YWx1ZVBvcHVwTGlzdEl0ZW0/OiBQb3B1cExpc3RJdGVtO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgYWxsb3dDdXN0b21WYWx1ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmaWx0ZXJhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAQ29udGVudENoaWxkKENvbWJvQm94R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBncm91cFRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGQoQ29tYm9Cb3hJdGVtVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgaXRlbVRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG92ZXJyaWRlIHZhbHVlPzogYW55O1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG92ZXJyaWRlIHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55IHwgYW55W10+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB2YWx1ZU5vcm1hbGl6ZXI6IEFjdGlvbjxPYnNlcnZhYmxlPHN0cmluZz4sIE9ic2VydmFibGU8YW55Pj4gPSAodGV4dCQ6IE9ic2VydmFibGU8c3RyaW5nPikgPT5cbiAgICAgICAgdGV4dCQucGlwZShtYXAodmFsdWUgPT4gdmFsdWUpKTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIG92ZXJyaWRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVhZG9ubHkgcG9wdXBMaXN0U2VydmljZTogUG9wdXBMaXN0U2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG92ZXJyaWRlIHJlYWRvbmx5IHBvcHVwU2VydmljZTogUG9wdXBTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnRSZWYsIHBvcHVwTGlzdFNlcnZpY2UsIHBvcHVwU2VydmljZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyVmFsdWUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuY29tYm9Cb3hWYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgICAgICAgaWYgKGNoYW5nZXNbXCJkYXRhXCJdICYmICFjaGFuZ2VzW1wiZGF0YVwiXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY29tYm9Cb3hWYWx1ZSA9IHRoaXMudmFsdWVQb3B1cExpc3RJdGVtPy50ZXh0ID8/IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5zZXRTdWJzY3JpcHRpb25zKCk7XG4gICAgICAgIHRoaXMuY29tYm9Cb3hWYWx1ZSA9IHRoaXMudmFsdWVQb3B1cExpc3RJdGVtPy50ZXh0ID8/IFwiXCI7XG4gICAgfVxuXG4gICAgcHVibGljIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uudmlld0xpc3REYXRhXG4gICAgICAgICAgICAgICAgLnNlbGVjdE1hbnkoZyA9PiBnLnNvdXJjZSlcbiAgICAgICAgICAgICAgICAuZmlyc3RPckRlZmF1bHQoaSA9PiBpLnRleHQudG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5jb21ib0JveFZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uuc2VsZWN0SXRlbShpdGVtLCB0aGlzLnNlbGVjdGlvbk1vZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFsbG93Q3VzdG9tVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZU5vcm1hbGl6ZXIob2YodGhpcy5jb21ib0JveFZhbHVlKSkuc3Vic2NyaWJlKG5vcm1hbGl6ZWRWYWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBbLi4udGhpcy5kYXRhLCBub3JtYWxpemVkVmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLmluaXRpYWxpemVMaXN0RGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogWy4uLnRoaXMuZGF0YV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVGaWVsZDogdGhpcy52YWx1ZUZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVyOiB0aGlzLml0ZW1EaXNhYmxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RmllbGQ6IHRoaXMudGV4dEZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRmllbGQ6IHRoaXMuZ3JvdXBGaWVsZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0T3JEZWZhdWx0KGkgPT4gaS50ZXh0LnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuY29tYm9Cb3hWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnNlbGVjdEl0ZW0oaXRlbSwgdGhpcy5zZWxlY3Rpb25Nb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbWJvQm94VmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvblBvcHVwTGlzdFZhbHVlQ2hhbmdlKGV2ZW50OiBQb3B1cExpc3RWYWx1ZUNoYW5nZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICghZXZlbnQudmFsdWUgfHwgZXZlbnQudmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbWJvQm94VmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZhbHVlICYmIGV2ZW50LnZhbHVlWzBdLmRhdGFFcXVhbHModGhpcy52YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChldmVudC52aWEgPT09IFwic2VsZWN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnZpYSA9PT0gXCJzZWxlY3Rpb25cIikge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQudmFsdWVbMF0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBvdmVycmlkZSBvcGVuKG9wdGlvbnM6IFBhcnRpYWw8UG9wdXBTZXR0aW5ncz4gPSB7fSk6IFBvcHVwUmVmIHtcbiAgICAgICAgdGhpcy5wb3B1cFJlZiA9IHN1cGVyLm9wZW4oe1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UoLTEsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucG9wdXBSZWY/LmNsb3NlZC5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgLmZpcnN0T3JEZWZhdWx0KGkgPT4gaS50ZXh0LnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuY29tYm9Cb3hWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tYm9Cb3hWYWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5wb3B1cFJlZjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgdXBkYXRlVmFsdWUobGlzdEl0ZW0/OiBQb3B1cExpc3RJdGVtKSB7XG4gICAgICAgIHN1cGVyLnVwZGF0ZVZhbHVlKGxpc3RJdGVtKTtcbiAgICAgICAgdGhpcy5jb21ib0JveFZhbHVlID0gbGlzdEl0ZW0/LnRleHQgPz8gXCJcIjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwiZm9jdXNvdXRcIilcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKHRhcmdldCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBSZWY/Lm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY29udGFpbnModGFyZ2V0KSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZnJvbUV2ZW50PEZvY3VzRXZlbnQ+KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBcImZvY3VzaW5cIilcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZSgtMSwgLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21ib0JveFZhbHVlJC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSkuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGEgPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uuc291cmNlTGlzdERhdGEudG9MaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS5maWx0ZXJNb2RlQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YSA9IHRoaXMucG9wdXBMaXN0U2VydmljZS5zb3VyY2VMaXN0RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNlbGVjdChnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gZy5zb3VyY2Uud2hlcmUoaSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh2YWx1ZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cDxzdHJpbmcsIFBvcHVwTGlzdEl0ZW0+KGcua2V5LCBmaWx0ZXJlZEl0ZW1zLnRvTGlzdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudG9MaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS5maWx0ZXJNb2RlQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uudmlld0xpc3REYXRhXG4gICAgICAgICAgICAgICAgLnNlbGVjdE1hbnkoZyA9PiBnLnNvdXJjZSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChpID0+IChpLnNlbGVjdGVkID0gaS5oaWdobGlnaHRlZCA9IGZhbHNlKSk7XG4gICAgICAgICAgICBjb25zdCBwb3B1cExpc3RJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgLmZpcnN0T3JEZWZhdWx0KGl0ZW0gPT4gIWl0ZW0uZGlzYWJsZWQgJiYgaXRlbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsdWUudG9Mb3dlckNhc2UoKSkpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBvcHVwUmVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9wdXBMaXN0SXRlbSkge1xuICAgICAgICAgICAgICAgIHBvcHVwTGlzdEl0ZW0uaGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS5zY3JvbGxUb0xpc3RJdGVtJC5uZXh0KHBvcHVwTGlzdEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21ib0JveFZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLWRyb3Bkb3duIG1vbmEtY29tYm8tYm94IG1vbmEtaW5wdXQtc2VsZWN0b3JcIiBbbmdDbGFzc109XCJ7J21vbmEtZGlzYWJsZWQnOiBkaXNhYmxlZH1cIiBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IC0xIDogMFwiICNkcm9wZG93bldyYXBwZXI+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtaW5wdXQtc2VsZWN0b3ItdmFsdWVcIj5cbiAgICAgICAgPG1vbmEtdGV4dC1ib3ggW25nTW9kZWxdPVwiY29tYm9Cb3hWYWx1ZVwiIChuZ01vZGVsQ2hhbmdlKT1cImNvbWJvQm94VmFsdWUkLm5leHQoJGV2ZW50KVwiIChrZXlkb3duKT1cIm9uS2V5ZG93bigkZXZlbnQpXCI+PC9tb25hLXRleHQtYm94PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtb25hLWlucHV0LXNlbGVjdG9yLWljb25cIiAqbmdJZj1cInNob3dDbGVhckJ1dHRvbiAmJiB2YWx1ZVBvcHVwTGlzdEl0ZW1cIj5cbiAgICAgICAgPGJ1dHRvbiBtb25hQnV0dG9uIFtmbGF0XT1cInRydWVcIiAoY2xpY2spPVwiY2xlYXJWYWx1ZSgkZXZlbnQpXCIgY2xhc3M9XCJtb25hLWRyb3Bkb3duLWNsZWFyLWljb25cIiB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgICA8ZmEtaWNvbiBbaWNvbl09XCJjbGVhckljb25cIj48L2ZhLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtb25hLWlucHV0LXNlbGVjdG9yLWljb25cIiAoY2xpY2spPVwib3BlbigpXCI+XG4gICAgICAgIDxmYS1pY29uIFtpY29uXT1cImRyb3Bkb3duSWNvblwiPjwvZmEtaWNvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI3BvcHVwVGVtcGxhdGU+XG4gICAgPGRpdiAqbmdJZj1cIiEhcG9wdXBSZWZcIj5cbiAgICAgICAgPG1vbmEtcG9wdXAtbGlzdCBbdGV4dEZpZWxkXT1cInRleHRGaWVsZFwiIFt2YWx1ZUZpZWxkXT1cInZhbHVlRmllbGRcIiBbZ3JvdXBGaWVsZF09XCJncm91cEZpZWxkXCIgW3ZhbHVlXT1cInZhbHVlID8gW3ZhbHVlXSA6IFtdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25Qb3B1cExpc3RWYWx1ZUNoYW5nZSgkZXZlbnQpXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbVRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG1vbmFMaXN0SXRlbVRlbXBsYXRlIGxldC1kYXRhSXRlbSBsZXQtbGlzdEl0ZW09XCJsaXN0SXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW1UZW1wbGF0ZSA/PyBudWxsXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGRhdGFJdGVtLCBsaXN0SXRlbX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZ3JvdXBUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBtb25hTGlzdEdyb3VwVGVtcGxhdGUgbGV0LWRhdGFJdGVtIGxldC1saXN0SXRlbT1cImxpc3RJdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZ3JvdXBUZW1wbGF0ZSA/PyBudWxsXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGRhdGFJdGVtLCBsaXN0SXRlbX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbW9uYS1wb3B1cC1saXN0PlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==