import { Component, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { PopupListService } from "../../services/popup-list.service";
import { fromEvent, Subject, take, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "../../services/popup-list.service";
import * as i2 from "../../../popup/services/popup.service";
export class AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.componentDestroy$ = new Subject();
        this.navigateWhileClosed = true;
        this.openOnEnter = false;
        this.clearIcon = faTimes;
        this.dropdownIcon = faChevronDown;
        this.popupRef = null;
        this.data = [];
        this.disabled = false;
        this.showClearButton = false;
    }
    close() {
        this.popupRef?.close();
        this.popupRef = null;
    }
    ngOnChanges(changes) {
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.popupListService.initializeListData({
                data: this.data,
                disabler: this.itemDisabler,
                textField: this.textField,
                valueField: this.valueField,
                groupField: this.groupField
            });
            this.updateValuePopupListItems();
        }
        if (changes["value"] && !changes["value"].isFirstChange()) {
            this.updateValuePopupListItems();
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.popupListService.initializeListData({
            data: this.data,
            disabler: this.itemDisabler,
            textField: this.textField,
            valueField: this.valueField,
            groupField: this.groupField
        });
        if (this.value) {
            if (this.selectionMode === "single") {
                this.valuePopupListItem = this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .singleOrDefault(d => d.dataEquals(this.value));
                if (this.valuePopupListItem) {
                    this.valuePopupListItem.selected = true;
                }
            }
            else {
                this.valuePopupListItem = this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .where(d => this.value.some(v => d.dataEquals(v)))
                    .toArray();
                this.valuePopupListItem.forEach(d => (d.selected = true));
            }
        }
        this.setEvents();
    }
    open(options = {}) {
        if (this.popupRef) {
            return this.popupRef;
        }
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.elementRef.nativeElement.offsetWidth,
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair({ originX: "start", originY: "bottom" }, { overlayX: "start", overlayY: "top" })
            ],
            ...options
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.elementRef.nativeElement.firstElementChild?.focus();
            this.popupListService.clearFilters();
        });
        return this.popupRef;
    }
    setEvents() {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            if (event.key === "Enter") {
                if (this.popupRef) {
                    if (this.selectionMode === "single") {
                        this.close();
                    }
                    return;
                }
                if (this.openOnEnter) {
                    this.open();
                }
            }
            else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                if (!this.navigateWhileClosed) {
                    return;
                }
                if (this.popupRef) {
                    return;
                }
                const listItem = this.popupListService.navigate(event, this.selectionMode);
                if (listItem) {
                    if (this.selectionMode === "single") {
                        if (listItem.dataEquals(this.value)) {
                            return;
                        }
                        this.updateValue(listItem);
                    }
                }
            }
            else if (event.key === "Escape") {
                this.close();
            }
        });
    }
    updateValue(listItem) {
        if (this.selectionMode === "single") {
            if (!listItem) {
                this.value = undefined;
                this.valuePopupListItem = undefined;
                this.valueChange.emit(undefined);
                return;
            }
            const item = listItem;
            if (item.dataEquals(this.value)) {
                return;
            }
            this.value = item.data;
            this.valuePopupListItem = item;
            this.valueChange.emit(item.data);
        }
        else {
            if (!listItem) {
                this.value = [];
                this.valuePopupListItem = [];
                this.valueChange.emit([]);
                return;
            }
            const items = listItem;
            this.valuePopupListItem = [...items];
            const values = items.map(v => v.data);
            this.value = values;
            this.valueChange.emit(values);
        }
    }
    updateValuePopupListItems() {
        if (this.selectionMode === "single") {
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .singleOrDefault(d => d.dataEquals(this.value));
        }
        else if (this.selectionMode === "multiple") {
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .where(d => this.value.some(v => d.dataEquals(v)))
                .toArray();
        }
    }
    setValue(value) {
        this.value = value;
        this.updateValuePopupListItems();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDropDownListComponent, deps: [{ token: i0.ElementRef }, { token: i1.PopupListService }, { token: i2.PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractDropDownListComponent, isStandalone: true, selector: "mona-abstract-drop-down-list", inputs: { data: "data", disabled: "disabled", groupField: "groupField", itemDisabler: "itemDisabler", placeholder: "placeholder", showClearButton: "showClearButton", textField: "textField", valueField: "valueField" }, providers: [PopupListService], viewQueries: [{ propertyName: "dropdownWrapper", first: true, predicate: ["dropdownWrapper"], descendants: true }, { propertyName: "popupTemplate", first: true, predicate: ["popupTemplate"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "", isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDropDownListComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-abstract-drop-down-list", standalone: true, imports: [CommonModule], template: "", providers: [PopupListService] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.PopupListService }, { type: i2.PopupService }]; }, propDecorators: { data: [{
                type: Input
            }], disabled: [{
                type: Input
            }], dropdownWrapper: [{
                type: ViewChild,
                args: ["dropdownWrapper"]
            }], groupField: [{
                type: Input
            }], itemDisabler: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], popupTemplate: [{
                type: ViewChild,
                args: ["popupTemplate"]
            }], showClearButton: [{
                type: Input
            }], textField: [{
                type: Input
            }], valueField: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtZHJvcC1kb3duLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2Ryb3Bkb3ducy9jb21wb25lbnRzL2Fic3RyYWN0LWRyb3AtZG93bi1saXN0L2Fic3RyYWN0LWRyb3AtZG93bi1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUdULEtBQUssRUFNTCxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFrQixNQUFNLG1DQUFtQyxDQUFDO0FBRzNGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRTlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFhM0QsTUFBTSxPQUFnQiw2QkFBNkI7SUFnRC9DLFlBQ3VCLFVBQW1DLEVBQ25DLGdCQUFrQyxFQUNsQyxZQUEwQjtRQUYxQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNuQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBbEQ5QixzQkFBaUIsR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUVoRSx3QkFBbUIsR0FBWSxJQUFJLENBQUM7UUFDcEMsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFDdkIsY0FBUyxHQUFtQixPQUFPLENBQUM7UUFDcEMsaUJBQVksR0FBbUIsYUFBYSxDQUFDO1FBQ3RELGFBQVEsR0FBb0IsSUFBSSxDQUFDO1FBR2pDLFNB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WXRCLElBQUk7c0JBRFYsS0FBSztnQkFJQyxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsZUFBZTtzQkFEckIsU0FBUzt1QkFBQyxpQkFBaUI7Z0JBSXJCLFVBQVU7c0JBRGhCLEtBQUs7Z0JBSUMsWUFBWTtzQkFEbEIsS0FBSztnQkFJQyxXQUFXO3NCQURqQixLQUFLO2dCQUlDLGFBQWE7c0JBRG5CLFNBQVM7dUJBQUMsZUFBZTtnQkFJbkIsZUFBZTtzQkFEckIsS0FBSztnQkFJQyxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsVUFBVTtzQkFEaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBmYUNoZXZyb25Eb3duLCBmYVRpbWVzLCBJY29uRGVmaW5pdGlvbiB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnNcIjtcbmltcG9ydCB7IFBvcHVwUmVmIH0gZnJvbSBcIi4uLy4uLy4uL3BvcHVwL21vZGVscy9Qb3B1cFJlZlwiO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uL3BvcHVwL3NlcnZpY2VzL3BvcHVwLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbm5lY3Rpb25Qb3NpdGlvblBhaXIgfSBmcm9tIFwiQGFuZ3VsYXIvY2RrL292ZXJsYXlcIjtcbmltcG9ydCB7IFBvcHVwU2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwU2V0dGluZ3NcIjtcbmltcG9ydCB7IFBvcHVwTGlzdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZXMvcG9wdXAtbGlzdC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YmplY3QsIHRha2UsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlIH0gZnJvbSBcIi4uLy4uLy4uL21vZGVscy9TZWxlY3Rpb25Nb2RlXCI7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvQWN0aW9uXCI7XG5pbXBvcnQgeyBQb3B1cExpc3RJdGVtIH0gZnJvbSBcIi4uLy4uL2RhdGEvUG9wdXBMaXN0SXRlbVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLWFic3RyYWN0LWRyb3AtZG93bi1saXN0XCIsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBzdHlsZVVybHM6IFtdLFxuICAgIHByb3ZpZGVyczogW1BvcHVwTGlzdFNlcnZpY2VdXG59KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0RHJvcERvd25MaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbXBvbmVudERlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBwcm90ZWN0ZWQgY3VycmVudFZhbHVlPzogYW55IHwgYW55W107XG4gICAgcHJvdGVjdGVkIG5hdmlnYXRlV2hpbGVDbG9zZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByb3RlY3RlZCBvcGVuT25FbnRlcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyByZWFkb25seSBjbGVhckljb246IEljb25EZWZpbml0aW9uID0gZmFUaW1lcztcbiAgICBwdWJsaWMgcmVhZG9ubHkgZHJvcGRvd25JY29uOiBJY29uRGVmaW5pdGlvbiA9IGZhQ2hldnJvbkRvd247XG4gICAgcHVibGljIHBvcHVwUmVmOiBQb3B1cFJlZiB8IG51bGwgPSBudWxsO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGF0YTogSXRlcmFibGU8YW55PiA9IFtdO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBWaWV3Q2hpbGQoXCJkcm9wZG93bldyYXBwZXJcIilcbiAgICBwdWJsaWMgZHJvcGRvd25XcmFwcGVyITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBncm91cEZpZWxkPzogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaXRlbURpc2FibGVyPzogQWN0aW9uPGFueSwgYm9vbGVhbj4gfCBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBwbGFjZWhvbGRlcj86IHN0cmluZztcblxuICAgIEBWaWV3Q2hpbGQoXCJwb3B1cFRlbXBsYXRlXCIpXG4gICAgcHVibGljIHBvcHVwVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd0NsZWFyQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0ZXh0RmllbGQ/OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB2YWx1ZUZpZWxkPzogc3RyaW5nO1xuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHNlbGVjdGlvbk1vZGU6IFNlbGVjdGlvbk1vZGU7XG4gICAgcHVibGljIGFic3RyYWN0IHZhbHVlUG9wdXBMaXN0SXRlbT86IFBvcHVwTGlzdEl0ZW0gfCBQb3B1cExpc3RJdGVtW107XG5cbiAgICAvLyBASW5wdXQoKVxuICAgIHB1YmxpYyBhYnN0cmFjdCB2YWx1ZT86IGFueSB8IGFueVtdO1xuXG4gICAgLy8gQE91dHB1dCgpXG4gICAgcHVibGljIGFic3RyYWN0IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55IHwgYW55W10+O1xuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb3B1cExpc3RTZXJ2aWNlOiBQb3B1cExpc3RTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9wdXBSZWY/LmNsb3NlKCk7XG4gICAgICAgIHRoaXMucG9wdXBSZWYgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzW1wiZGF0YVwiXSAmJiAhY2hhbmdlc1tcImRhdGFcIl0uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwTGlzdFNlcnZpY2UuaW5pdGlhbGl6ZUxpc3REYXRhKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLmRhdGEsXG4gICAgICAgICAgICAgICAgZGlzYWJsZXI6IHRoaXMuaXRlbURpc2FibGVyLFxuICAgICAgICAgICAgICAgIHRleHRGaWVsZDogdGhpcy50ZXh0RmllbGQsXG4gICAgICAgICAgICAgICAgdmFsdWVGaWVsZDogdGhpcy52YWx1ZUZpZWxkLFxuICAgICAgICAgICAgICAgIGdyb3VwRmllbGQ6IHRoaXMuZ3JvdXBGaWVsZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlUG9wdXBMaXN0SXRlbXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1tcInZhbHVlXCJdICYmICFjaGFuZ2VzW1widmFsdWVcIl0uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlUG9wdXBMaXN0SXRlbXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9wdXBMaXN0U2VydmljZS5pbml0aWFsaXplTGlzdERhdGEoe1xuICAgICAgICAgICAgZGF0YTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgZGlzYWJsZXI6IHRoaXMuaXRlbURpc2FibGVyLFxuICAgICAgICAgICAgdGV4dEZpZWxkOiB0aGlzLnRleHRGaWVsZCxcbiAgICAgICAgICAgIHZhbHVlRmllbGQ6IHRoaXMudmFsdWVGaWVsZCxcbiAgICAgICAgICAgIGdyb3VwRmllbGQ6IHRoaXMuZ3JvdXBGaWVsZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlUG9wdXBMaXN0SXRlbSA9IHRoaXMucG9wdXBMaXN0U2VydmljZS52aWV3TGlzdERhdGFcbiAgICAgICAgICAgICAgICAgICAgLnNlbGVjdE1hbnkoZyA9PiBnLnNvdXJjZSlcbiAgICAgICAgICAgICAgICAgICAgLnNpbmdsZU9yRGVmYXVsdChkID0+IGQuZGF0YUVxdWFscyh0aGlzLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWVQb3B1cExpc3RJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVQb3B1cExpc3RJdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVQb3B1cExpc3RJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgICAgICAuc2VsZWN0TWFueShnID0+IGcuc291cmNlKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoZCA9PiAodGhpcy52YWx1ZSBhcyBhbnlbXSkuc29tZSh2ID0+IGQuZGF0YUVxdWFscyh2KSkpXG4gICAgICAgICAgICAgICAgICAgIC50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVBvcHVwTGlzdEl0ZW0uZm9yRWFjaChkID0+IChkLnNlbGVjdGVkID0gdHJ1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9wZW4ob3B0aW9uczogUGFydGlhbDxQb3B1cFNldHRpbmdzPiA9IHt9KTogUG9wdXBSZWYge1xuICAgICAgICBpZiAodGhpcy5wb3B1cFJlZikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9wdXBSZWY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcm9wZG93bldyYXBwZXIubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB0aGlzLnBvcHVwUmVmID0gdGhpcy5wb3B1cFNlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgIGFuY2hvcjogdGhpcy5kcm9wZG93bldyYXBwZXIsXG4gICAgICAgICAgICBjb250ZW50OiB0aGlzLnBvcHVwVGVtcGxhdGUsXG4gICAgICAgICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgICAgICAgIHdpdGhQdXNoOiBmYWxzZSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgIHBvcHVwQ2xhc3M6IFtcIm1vbmEtZHJvcGRvd24tcG9wdXAtY29udGVudFwiXSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAgICAgIG5ldyBDb25uZWN0aW9uUG9zaXRpb25QYWlyKFxuICAgICAgICAgICAgICAgICAgICB7IG9yaWdpblg6IFwic3RhcnRcIiwgb3JpZ2luWTogXCJib3R0b21cIiB9LFxuICAgICAgICAgICAgICAgICAgICB7IG92ZXJsYXlYOiBcInN0YXJ0XCIsIG92ZXJsYXlZOiBcInRvcFwiIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wb3B1cFJlZi5jbG9zZWQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1cFJlZiA9IG51bGw7XG4gICAgICAgICAgICAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQpPy5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5wb3B1cExpc3RTZXJ2aWNlLmNsZWFyRmlsdGVycygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdXBSZWY7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpOiB2b2lkIHtcbiAgICAgICAgZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBcImtleWRvd25cIilcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcHVwUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSBcInNpbmdsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wZW5PbkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiIHx8IGV2ZW50LmtleSA9PT0gXCJBcnJvd1VwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm5hdmlnYXRlV2hpbGVDbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3B1cFJlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLm5hdmlnYXRlKGV2ZW50LCB0aGlzLnNlbGVjdGlvbk1vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdEl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdEl0ZW0uZGF0YUVxdWFscyh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUobGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1cGRhdGVWYWx1ZShsaXN0SXRlbTogUG9wdXBMaXN0SXRlbSB8IFBvcHVwTGlzdEl0ZW1bXSB8IG51bGwgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gXCJzaW5nbGVcIikge1xuICAgICAgICAgICAgaWYgKCFsaXN0SXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVBvcHVwTGlzdEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGxpc3RJdGVtIGFzIFBvcHVwTGlzdEl0ZW07XG4gICAgICAgICAgICBpZiAoaXRlbS5kYXRhRXF1YWxzKHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGl0ZW0uZGF0YTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVQb3B1cExpc3RJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChpdGVtLmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFsaXN0SXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlUG9wdXBMaXN0SXRlbSA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChbXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBsaXN0SXRlbSBhcyBQb3B1cExpc3RJdGVtW107XG4gICAgICAgICAgICB0aGlzLnZhbHVlUG9wdXBMaXN0SXRlbSA9IFsuLi5pdGVtc107XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBpdGVtcy5tYXAodiA9PiB2LmRhdGEpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlcztcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlUG9wdXBMaXN0SXRlbXMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVQb3B1cExpc3RJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgLnNpbmdsZU9yRGVmYXVsdChkID0+IGQuZGF0YUVxdWFscyh0aGlzLnZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSBcIm11bHRpcGxlXCIpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVQb3B1cExpc3RJdGVtID0gdGhpcy5wb3B1cExpc3RTZXJ2aWNlLnZpZXdMaXN0RGF0YVxuICAgICAgICAgICAgICAgIC5zZWxlY3RNYW55KGcgPT4gZy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgLndoZXJlKGQgPT4gKHRoaXMudmFsdWUgYXMgYW55W10pLnNvbWUodiA9PiBkLmRhdGFFcXVhbHModikpKVxuICAgICAgICAgICAgICAgIC50b0FycmF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VmFsdWUodmFsdWU6IGFueSB8IGFueVtdIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZVBvcHVwTGlzdEl0ZW1zKCk7XG4gICAgfVxufVxuIl19