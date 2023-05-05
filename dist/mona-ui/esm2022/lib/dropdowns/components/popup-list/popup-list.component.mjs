import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, QueryList, SkipSelf, TemplateRef, ViewChildren } from "@angular/core";
import { debounceTime, fromEvent, Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { PopupListItemComponent } from "../popup-list-item/popup-list-item.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FormsModule } from "@angular/forms";
import * as i0 from "@angular/core";
import * as i1 from "../../services/popup-list.service";
import * as i2 from "@angular/common";
import * as i3 from "../../../inputs/modules/text-box/components/text-box/text-box.component";
import * as i4 from "../../../inputs/modules/text-box/directives/text-box-prefix-template.directive";
import * as i5 from "@fortawesome/angular-fontawesome";
import * as i6 from "@angular/forms";
export class PopupListComponent {
    set highlightedValues(values) {
        this.updateHighlightedValues(values);
    }
    constructor(popupListService, cdr) {
        this.popupListService = popupListService;
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.filterIcon = faSearch;
        this.filter$ = new Subject();
        this.filterable = false;
        this.navigable = true;
        this.popupListItemComponents = new QueryList();
        this.selectionMode = "single";
        this.value = [];
        this.valueChange = new EventEmitter();
    }
    ngAfterViewInit() {
        const firstSelectedItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .firstOrDefault(i => i.selected || i.highlighted);
        if (firstSelectedItem) {
            window.setTimeout(() => this.scrollToItem(firstSelectedItem), 0);
        }
    }
    ngOnChanges(changes) {
        if (changes["highlightedValues"] && changes["highlightedValues"].isFirstChange()) {
            window.setTimeout(() => this.updateHighlightedValues(changes["highlightedValues"].currentValue));
        }
        if (changes["value"]) {
            window.setTimeout(() => {
                this.updateSelectedValues(changes["value"].currentValue);
                if (changes["value"].isFirstChange() || this.selectionMode === "single") {
                    const firstSelectedItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(i => i.selected || i.highlighted);
                    if (firstSelectedItem) {
                        window.setTimeout(() => this.scrollToItem(firstSelectedItem), 0);
                    }
                }
            });
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.popupListService.viewListData.selectMany(g => g.source).forEach(i => (i.selected = false));
    }
    ngOnInit() {
        const selectedItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .firstOrDefault(i => i.dataEquals(this.value));
        if (selectedItem) {
            selectedItem.selected = true;
        }
        this.setEvents();
        this.setSubscriptions();
    }
    onListItemClick(item, event) {
        if (item.disabled) {
            return;
        }
        if (this.selectionMode === "single") {
            this.updateSelectedValues([item.data]);
            this.value = [item.data];
            this.valueChange.emit({
                value: [item],
                via: "selection"
            });
        }
        else if (this.selectionMode === "multiple") {
            item.selected = !item.selected;
            let values = [...this.value];
            let items = [];
            if (item.selected) {
                values.push(item.data);
                items = this.popupListService.getListItemsOfValues(values);
            }
            else {
                const valueItems = this.popupListService.getListItemsOfValues(values);
                items = valueItems.filter(i => !i.dataEquals(item));
            }
            this.valueChange.emit({
                via: "selection",
                value: items
            });
        }
    }
    findListItemComponent(item) {
        const component = this.popupListItemComponents.find(c => c.item?.dataEquals(item.data) ?? false);
        return component ?? null;
    }
    scrollToItem(item) {
        const component = this.findListItemComponent(item);
        if (component) {
            component.elementRef.nativeElement.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }
    setEvents() {
        fromEvent(document, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                if (!this.navigable) {
                    return;
                }
                event.stopImmediatePropagation();
                event.preventDefault();
                const listItem = this.popupListService.navigate(event, this.selectionMode);
                if (listItem) {
                    this.scrollToItem(listItem);
                    if (this.selectionMode === "single") {
                        this.valueChange.emit({
                            via: "navigation",
                            value: [listItem]
                        });
                    }
                }
            }
            else if (event.key === "Enter") {
                if (this.selectionMode === "multiple") {
                    const highlightedItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(i => i.highlighted);
                    if (highlightedItem) {
                        if (highlightedItem.selected) {
                            highlightedItem.selected = false;
                            const values = this.value.filter(v => !highlightedItem.dataEquals(v));
                            const items = this.popupListService.getListItemsOfValues(values);
                            this.valueChange.emit({
                                via: "selection",
                                value: items
                            });
                        }
                        else {
                            highlightedItem.selected = true;
                            const values = [...this.value, highlightedItem.data];
                            const items = this.popupListService.getListItemsOfValues(values);
                            this.valueChange.emit({
                                via: "selection",
                                value: items
                            });
                        }
                    }
                }
                else {
                    if (this.popupListService.filterModeActive) {
                        const selectedItem = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.selected);
                        if (selectedItem) {
                            this.valueChange.emit({
                                value: [selectedItem],
                                via: "selection"
                            });
                        }
                    }
                }
            }
        });
    }
    setSubscriptions() {
        this.filter$
            .pipe(takeUntil(this.componentDestroy$), debounceTime(200))
            .subscribe(filter => this.popupListService.filterItems(filter, this.selectionMode));
        this.popupListService.scrollToListItem$
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(item => this.scrollToItem(item));
    }
    updateHighlightedValues(values) {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.highlighted = values.length === 0 ? false : values.some(v => i.dataEquals(v));
            });
        });
    }
    updateSelectedValues(values) {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.selected = values.length === 0 ? false : values.some(v => i.dataEquals(v));
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListComponent, deps: [{ token: i1.PopupListService, skipSelf: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: PopupListComponent, isStandalone: true, selector: "mona-popup-list", inputs: { filterable: "filterable", groupField: "groupField", highlightedValues: "highlightedValues", navigable: "navigable", selectionMode: "selectionMode", textField: "textField", value: "value", valueField: "valueField" }, outputs: { valueChange: "valueChange" }, queries: [{ propertyName: "groupTemplate", first: true, predicate: ListGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: ListItemTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "popupListItemComponents", predicate: PopupListItemComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<ul class=\"mona-list\" [attr.tabindex]=\"-1\">\n    <ng-container *ngIf=\"popupListService.viewListData.length !== 0; else empty;\">\n        <ng-container *ngIf=\"filterable\">\n            <mona-text-box class=\"filter-box\" [ngModel]=\"filter$|async\" (ngModelChange)=\"filter$.next($event)\">\n                <ng-template monaTextBoxPrefixTemplate>\n                    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n                </ng-template>\n            </mona-text-box>\n        </ng-container>\n        <ng-container *ngFor=\"let group of popupListService.viewListData\">\n            <ng-container *ngIf=\"$any(group.source).length !== 0\">\n                <ng-container *ngIf=\"!groupTemplate\">\n                    <li class=\"mona-list-group-header\" *ngIf=\"group.key\">{{group.key}}</li>\n                </ng-container>\n                <ng-container *ngIf=\"groupTemplate && group.key\">\n                    <li class=\"mona-list-group-header\">\n                        <ng-container [ngTemplateOutlet]=\"groupTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: group.key}\"></ng-container>\n                    </li>\n                </ng-container>\n            </ng-container>\n            <li class=\"mona-list-item\" *ngFor=\"let item of group.source\" (click)=\"onListItemClick(item, $event)\"\n                [ngClass]=\"{'mona-selected': item.selected, 'mona-highlighted': item.highlighted, 'mona-disabled': item.disabled}\">\n                <mona-popup-list-item [item]=\"item\" [itemTemplate]=\"itemTemplate\"></mona-popup-list-item>\n            </li>\n        </ng-container>\n    </ng-container>\n    <ng-template #empty>\n        <div class=\"mona-list-no-data\">No data.</div>\n    </ng-template>\n</ul>\n", styles: [":host{width:100%;height:100%}ul.mona-list{list-style:none;-webkit-user-select:none;user-select:none;width:100%;outline:none}ul.mona-list li{display:flex;align-items:center;justify-content:flex-start;padding:4px 8px;line-height:1.42857143;white-space:nowrap;overflow:hidden;cursor:pointer}li.mona-list-group-header{pointer-events:none;font-weight:700}mona-text-box.filter-box{border:none}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "component", type: PopupListItemComponent, selector: "mona-popup-list-item", inputs: ["item", "itemTemplate"] }, { kind: "ngmodule", type: TextBoxModule }, { kind: "component", type: i3.TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i4.TextBoxPrefixTemplateDirective, selector: "ng-template[monaTextBoxPrefixTemplate]" }, { kind: "ngmodule", type: FontAwesomeModule }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], changeDetection: i0.ChangeDetectionStrategy.Default }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-popup-list", standalone: true, imports: [CommonModule, PopupListItemComponent, TextBoxModule, FontAwesomeModule, FormsModule], changeDetection: ChangeDetectionStrategy.Default, template: "<ul class=\"mona-list\" [attr.tabindex]=\"-1\">\n    <ng-container *ngIf=\"popupListService.viewListData.length !== 0; else empty;\">\n        <ng-container *ngIf=\"filterable\">\n            <mona-text-box class=\"filter-box\" [ngModel]=\"filter$|async\" (ngModelChange)=\"filter$.next($event)\">\n                <ng-template monaTextBoxPrefixTemplate>\n                    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n                </ng-template>\n            </mona-text-box>\n        </ng-container>\n        <ng-container *ngFor=\"let group of popupListService.viewListData\">\n            <ng-container *ngIf=\"$any(group.source).length !== 0\">\n                <ng-container *ngIf=\"!groupTemplate\">\n                    <li class=\"mona-list-group-header\" *ngIf=\"group.key\">{{group.key}}</li>\n                </ng-container>\n                <ng-container *ngIf=\"groupTemplate && group.key\">\n                    <li class=\"mona-list-group-header\">\n                        <ng-container [ngTemplateOutlet]=\"groupTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: group.key}\"></ng-container>\n                    </li>\n                </ng-container>\n            </ng-container>\n            <li class=\"mona-list-item\" *ngFor=\"let item of group.source\" (click)=\"onListItemClick(item, $event)\"\n                [ngClass]=\"{'mona-selected': item.selected, 'mona-highlighted': item.highlighted, 'mona-disabled': item.disabled}\">\n                <mona-popup-list-item [item]=\"item\" [itemTemplate]=\"itemTemplate\"></mona-popup-list-item>\n            </li>\n        </ng-container>\n    </ng-container>\n    <ng-template #empty>\n        <div class=\"mona-list-no-data\">No data.</div>\n    </ng-template>\n</ul>\n", styles: [":host{width:100%;height:100%}ul.mona-list{list-style:none;-webkit-user-select:none;user-select:none;width:100%;outline:none}ul.mona-list li{display:flex;align-items:center;justify-content:flex-start;padding:4px 8px;line-height:1.42857143;white-space:nowrap;overflow:hidden;cursor:pointer}li.mona-list-group-header{pointer-events:none;font-weight:700}mona-text-box.filter-box{border:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.PopupListService, decorators: [{
                    type: SkipSelf
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { filterable: [{
                type: Input
            }], groupField: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [ListGroupTemplateDirective, { read: TemplateRef }]
            }], highlightedValues: [{
                type: Input
            }], itemTemplate: [{
                type: ContentChild,
                args: [ListItemTemplateDirective, { read: TemplateRef }]
            }], navigable: [{
                type: Input
            }], popupListItemComponents: [{
                type: ViewChildren,
                args: [PopupListItemComponent]
            }], selectionMode: [{
                type: Input
            }], textField: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], valueField: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAtbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZHJvcGRvd25zL2NvbXBvbmVudHMvcG9wdXAtbGlzdC9wb3B1cC1saXN0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kcm9wZG93bnMvY29tcG9uZW50cy9wb3B1cC1saXN0L3BvcHVwLWxpc3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxFQUNOLFNBQVMsRUFFVCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFlBQVksRUFDZixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUV0RixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDakYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLFFBQVEsRUFBa0IsTUFBTSxtQ0FBbUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7O0FBVTdDLE1BQU0sT0FBTyxrQkFBa0I7SUFjM0Is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VyxFQUFFO2dCQUl2RCxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsdUJBQXVCO3NCQUQ3QixZQUFZO3VCQUFDLHNCQUFzQjtnQkFJN0IsYUFBYTtzQkFEbkIsS0FBSztnQkFJQyxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsS0FBSztzQkFEWCxLQUFLO2dCQUlDLFdBQVc7c0JBRGpCLE1BQU07Z0JBSUEsVUFBVTtzQkFEaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgU2tpcFNlbGYsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkcmVuXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQb3B1cExpc3RJdGVtIH0gZnJvbSBcIi4uLy4uL2RhdGEvUG9wdXBMaXN0SXRlbVwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZSB9IGZyb20gXCIuLi8uLi8uLi9tb2RlbHMvU2VsZWN0aW9uTW9kZVwiO1xuaW1wb3J0IHsgUG9wdXBMaXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9wb3B1cC1saXN0LnNlcnZpY2VcIjtcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZnJvbUV2ZW50LCBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgUG9wdXBMaXN0SXRlbUNvbXBvbmVudCB9IGZyb20gXCIuLi9wb3B1cC1saXN0LWl0ZW0vcG9wdXAtbGlzdC1pdGVtLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgUG9wdXBMaXN0VmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gXCIuLi8uLi9kYXRhL1BvcHVwTGlzdFZhbHVlQ2hhbmdlRXZlbnRcIjtcbmltcG9ydCB7IExpc3RJdGVtVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9saXN0LWl0ZW0tdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBMaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL2xpc3QtZ3JvdXAtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBUZXh0Qm94TW9kdWxlIH0gZnJvbSBcIi4uLy4uLy4uL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L3RleHQtYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgRm9udEF3ZXNvbWVNb2R1bGUgfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWVcIjtcbmltcG9ydCB7IGZhU2VhcmNoLCBJY29uRGVmaW5pdGlvbiB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnNcIjtcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtcG9wdXAtbGlzdFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vcG9wdXAtbGlzdC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9wb3B1cC1saXN0LmNvbXBvbmVudC5zY3NzXCJdLFxuICAgIHN0YW5kYWxvbmU6IHRydWUsXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUG9wdXBMaXN0SXRlbUNvbXBvbmVudCwgVGV4dEJveE1vZHVsZSwgRm9udEF3ZXNvbWVNb2R1bGUsIEZvcm1zTW9kdWxlXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHRcbn0pXG5leHBvcnQgY2xhc3MgUG9wdXBMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnREZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHVibGljIHJlYWRvbmx5IGZpbHRlckljb246IEljb25EZWZpbml0aW9uID0gZmFTZWFyY2g7XG4gICAgcHVibGljIHJlYWRvbmx5IGZpbHRlciQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGZpbHRlcmFibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdyb3VwRmllbGQ/OiBzdHJpbmc7XG5cbiAgICBAQ29udGVudENoaWxkKExpc3RHcm91cFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGdyb3VwVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGhpZ2hsaWdodGVkVmFsdWVzKHZhbHVlczogYW55W10pIHtcbiAgICAgICAgdGhpcy51cGRhdGVIaWdobGlnaHRlZFZhbHVlcyh2YWx1ZXMpO1xuICAgIH1cblxuICAgIEBDb250ZW50Q2hpbGQoTGlzdEl0ZW1UZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBpdGVtVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbmF2aWdhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBWaWV3Q2hpbGRyZW4oUG9wdXBMaXN0SXRlbUNvbXBvbmVudClcbiAgICBwdWJsaWMgcG9wdXBMaXN0SXRlbUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxQb3B1cExpc3RJdGVtQ29tcG9uZW50PiA9IG5ldyBRdWVyeUxpc3Q8UG9wdXBMaXN0SXRlbUNvbXBvbmVudD4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNlbGVjdGlvbk1vZGU6IFNlbGVjdGlvbk1vZGUgPSBcInNpbmdsZVwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdGV4dEZpZWxkPzogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdmFsdWU6IGFueVtdID0gW107XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxQb3B1cExpc3RWYWx1ZUNoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8UG9wdXBMaXN0VmFsdWVDaGFuZ2VFdmVudD4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHZhbHVlRmllbGQ/OiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIEBTa2lwU2VsZigpXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBwb3B1cExpc3RTZXJ2aWNlOiBQb3B1cExpc3RTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBmaXJzdFNlbGVjdGVkSXRlbSA9IHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGFcbiAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAuZmlyc3RPckRlZmF1bHQoaSA9PiBpLnNlbGVjdGVkIHx8IGkuaGlnaGxpZ2h0ZWQpO1xuICAgICAgICBpZiAoZmlyc3RTZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMuc2Nyb2xsVG9JdGVtKGZpcnN0U2VsZWN0ZWRJdGVtKSwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlc1tcImhpZ2hsaWdodGVkVmFsdWVzXCJdICYmIGNoYW5nZXNbXCJoaWdobGlnaHRlZFZhbHVlc1wiXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlSGlnaGxpZ2h0ZWRWYWx1ZXMoY2hhbmdlc1tcImhpZ2hsaWdodGVkVmFsdWVzXCJdLmN1cnJlbnRWYWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzW1widmFsdWVcIl0pIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWVzKGNoYW5nZXNbXCJ2YWx1ZVwiXS5jdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VzW1widmFsdWVcIl0uaXNGaXJzdENoYW5nZSgpIHx8IHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gXCJzaW5nbGVcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFNlbGVjdGVkSXRlbSA9IHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlyc3RPckRlZmF1bHQoaSA9PiBpLnNlbGVjdGVkIHx8IGkuaGlnaGxpZ2h0ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlyc3RTZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMuc2Nyb2xsVG9JdGVtKGZpcnN0U2VsZWN0ZWRJdGVtKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQuY29tcGxldGUoKTtcbiAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YS5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpLmZvckVhY2goaSA9PiAoaS5zZWxlY3RlZCA9IGZhbHNlKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uudmlld0xpc3REYXRhXG4gICAgICAgICAgICAuc2VsZWN0TWFueShnID0+IGcuc291cmNlKVxuICAgICAgICAgICAgLmZpcnN0T3JEZWZhdWx0KGkgPT4gaS5kYXRhRXF1YWxzKHRoaXMudmFsdWUpKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuICAgICAgICB0aGlzLnNldFN1YnNjcmlwdGlvbnMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25MaXN0SXRlbUNsaWNrKGl0ZW06IFBvcHVwTGlzdEl0ZW0sIGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gXCJzaW5nbGVcIikge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlcyhbaXRlbS5kYXRhXSk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gW2l0ZW0uZGF0YV07XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBbaXRlbV0sXG4gICAgICAgICAgICAgICAgdmlhOiBcInNlbGVjdGlvblwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09IFwibXVsdGlwbGVcIikge1xuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9ICFpdGVtLnNlbGVjdGVkO1xuICAgICAgICAgICAgbGV0IHZhbHVlczogYW55W10gPSBbLi4udGhpcy52YWx1ZV07XG4gICAgICAgICAgICBsZXQgaXRlbXM6IFBvcHVwTGlzdEl0ZW1bXSA9IFtdO1xuICAgICAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChpdGVtLmRhdGEpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLmdldExpc3RJdGVtc09mVmFsdWVzKHZhbHVlcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlSXRlbXMgPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2UuZ2V0TGlzdEl0ZW1zT2ZWYWx1ZXModmFsdWVzKTtcbiAgICAgICAgICAgICAgICBpdGVtcyA9IHZhbHVlSXRlbXMuZmlsdGVyKGkgPT4gIWkuZGF0YUVxdWFscyhpdGVtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIHZpYTogXCJzZWxlY3Rpb25cIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kTGlzdEl0ZW1Db21wb25lbnQoaXRlbTogUG9wdXBMaXN0SXRlbSk6IFBvcHVwTGlzdEl0ZW1Db21wb25lbnQgfCBudWxsIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5wb3B1cExpc3RJdGVtQ29tcG9uZW50cy5maW5kKGMgPT4gYy5pdGVtPy5kYXRhRXF1YWxzKGl0ZW0uZGF0YSkgPz8gZmFsc2UpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50ID8/IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY3JvbGxUb0l0ZW0oaXRlbTogUG9wdXBMaXN0SXRlbSk6IHZvaWQge1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmZpbmRMaXN0SXRlbUNvbXBvbmVudChpdGVtKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiBcImF1dG9cIiwgYmxvY2s6IFwiY2VudGVyXCIgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEV2ZW50cygpOiB2b2lkIHtcbiAgICAgICAgZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KGRvY3VtZW50LCBcImtleWRvd25cIilcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd0Rvd25cIiB8fCBldmVudC5rZXkgPT09IFwiQXJyb3dVcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5uYXZpZ2FibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdEl0ZW0gPSB0aGlzLnBvcHVwTGlzdFNlcnZpY2UubmF2aWdhdGUoZXZlbnQsIHRoaXMuc2VsZWN0aW9uTW9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0l0ZW0obGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gXCJzaW5nbGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYTogXCJuYXZpZ2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBbbGlzdEl0ZW1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09IFwibXVsdGlwbGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGlnaGxpZ2h0ZWRJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0T3JEZWZhdWx0KGkgPT4gaS5oaWdobGlnaHRlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0ZWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodGVkSXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZEl0ZW0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy52YWx1ZS5maWx0ZXIodiA9PiAhaGlnaGxpZ2h0ZWRJdGVtLmRhdGFFcXVhbHModikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucG9wdXBMaXN0U2VydmljZS5nZXRMaXN0SXRlbXNPZlZhbHVlcyh2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlhOiBcInNlbGVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkSXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IFsuLi50aGlzLnZhbHVlLCBoaWdobGlnaHRlZEl0ZW0uZGF0YV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLmdldExpc3RJdGVtc09mVmFsdWVzKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWE6IFwic2VsZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucG9wdXBMaXN0U2VydmljZS5maWx0ZXJNb2RlQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2VsZWN0TWFueShnID0+IGcuc291cmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlyc3RPckRlZmF1bHQoaSA9PiBpLnNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogW3NlbGVjdGVkSXRlbV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWE6IFwic2VsZWN0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTdWJzY3JpcHRpb25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZpbHRlciRcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSwgZGVib3VuY2VUaW1lKDIwMCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGZpbHRlciA9PiB0aGlzLnBvcHVwTGlzdFNlcnZpY2UuZmlsdGVySXRlbXMoZmlsdGVyLCB0aGlzLnNlbGVjdGlvbk1vZGUpKTtcbiAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnNjcm9sbFRvTGlzdEl0ZW0kXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGl0ZW0gPT4gdGhpcy5zY3JvbGxUb0l0ZW0oaXRlbSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSGlnaGxpZ2h0ZWRWYWx1ZXModmFsdWVzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnBvcHVwTGlzdFNlcnZpY2Uudmlld0xpc3REYXRhLmZvckVhY2goZyA9PiB7XG4gICAgICAgICAgICBnLnNvdXJjZS5mb3JFYWNoKGkgPT4ge1xuICAgICAgICAgICAgICAgIGkuaGlnaGxpZ2h0ZWQgPSB2YWx1ZXMubGVuZ3RoID09PSAwID8gZmFsc2UgOiB2YWx1ZXMuc29tZSh2ID0+IGkuZGF0YUVxdWFscyh2KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTZWxlY3RlZFZhbHVlcyh2YWx1ZXM6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGEuZm9yRWFjaChnID0+IHtcbiAgICAgICAgICAgIGcuc291cmNlLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICAgICAgaS5zZWxlY3RlZCA9IHZhbHVlcy5sZW5ndGggPT09IDAgPyBmYWxzZSA6IHZhbHVlcy5zb21lKHYgPT4gaS5kYXRhRXF1YWxzKHYpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCI8dWwgY2xhc3M9XCJtb25hLWxpc3RcIiBbYXR0ci50YWJpbmRleF09XCItMVwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJwb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YS5sZW5ndGggIT09IDA7IGVsc2UgZW1wdHk7XCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJmaWx0ZXJhYmxlXCI+XG4gICAgICAgICAgICA8bW9uYS10ZXh0LWJveCBjbGFzcz1cImZpbHRlci1ib3hcIiBbbmdNb2RlbF09XCJmaWx0ZXIkfGFzeW5jXCIgKG5nTW9kZWxDaGFuZ2UpPVwiZmlsdGVyJC5uZXh0KCRldmVudClcIj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbW9uYVRleHRCb3hQcmVmaXhUZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPGZhLWljb24gW2ljb25dPVwiZmlsdGVySWNvblwiPjwvZmEtaWNvbj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9tb25hLXRleHQtYm94PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgZ3JvdXAgb2YgcG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGFcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIkYW55KGdyb3VwLnNvdXJjZSkubGVuZ3RoICE9PSAwXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFncm91cFRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cIm1vbmEtbGlzdC1ncm91cC1oZWFkZXJcIiAqbmdJZj1cImdyb3VwLmtleVwiPnt7Z3JvdXAua2V5fX08L2xpPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJncm91cFRlbXBsYXRlICYmIGdyb3VwLmtleVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJtb25hLWxpc3QtZ3JvdXAtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImdyb3VwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogZ3JvdXAua2V5fVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJtb25hLWxpc3QtaXRlbVwiICpuZ0Zvcj1cImxldCBpdGVtIG9mIGdyb3VwLnNvdXJjZVwiIChjbGljayk9XCJvbkxpc3RJdGVtQ2xpY2soaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydtb25hLXNlbGVjdGVkJzogaXRlbS5zZWxlY3RlZCwgJ21vbmEtaGlnaGxpZ2h0ZWQnOiBpdGVtLmhpZ2hsaWdodGVkLCAnbW9uYS1kaXNhYmxlZCc6IGl0ZW0uZGlzYWJsZWR9XCI+XG4gICAgICAgICAgICAgICAgPG1vbmEtcG9wdXAtbGlzdC1pdGVtIFtpdGVtXT1cIml0ZW1cIiBbaXRlbVRlbXBsYXRlXT1cIml0ZW1UZW1wbGF0ZVwiPjwvbW9uYS1wb3B1cC1saXN0LWl0ZW0+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctdGVtcGxhdGUgI2VtcHR5PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9uYS1saXN0LW5vLWRhdGFcIj5ObyBkYXRhLjwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG48L3VsPlxuIl19