import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FilterMenuComponent } from "../../../filter/components/filter-menu/filter-menu.component";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "../../../popup/services/popup.service";
import * as i2 from "../../services/grid.service";
import * as i3 from "@angular/common";
import * as i4 from "../../../buttons/modules/button/directives/button.directive";
import * as i5 from "@fortawesome/angular-fontawesome";
export class GridFilterMenuComponent {
    #destroy;
    constructor(cdr, popupService, elementRef, gridService) {
        this.cdr = cdr;
        this.popupService = popupService;
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.#destroy = new Subject();
        this.filterIcon = faFilter;
        this.apply = new EventEmitter();
        this.type = "string";
    }
    ngOnDestroy() {
        this.#destroy.next();
        this.#destroy.complete();
    }
    ngOnInit() {
        this.setSubscriptions();
    }
    openPopup() {
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: FilterMenuComponent,
            popupClass: "mona-grid-filter-menu-popup-content",
            preventClose: event => {
                if (event.originalEvent instanceof MouseEvent) {
                    const target = event.originalEvent.target;
                    if (target.closest(".mona-popup-content")) {
                        return true;
                    }
                }
                return false;
            }
        });
        const filterState = this.gridService.appliedFilters.get(this.column.field);
        const componentRef = this.popupRef.component;
        componentRef.instance.type = this.type;
        componentRef.instance.field = this.column.field;
        if (filterState?.filterMenuValue) {
            componentRef.instance.value = filterState.filterMenuValue;
        }
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.apply.pipe().subscribe(filter => {
            const filterState = {
                filter,
                filterMenuValue: componentRef.instance.value
            };
            this.popupRef?.close();
            this.apply.emit(filterState);
        });
    }
    setSubscriptions() {
        this.gridService.filterLoad$.pipe(takeUntil(this.#destroy)).subscribe(() => {
            this.cdr.detectChanges();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterMenuComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.PopupService }, { token: i0.ElementRef }, { token: i2.GridService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridFilterMenuComponent, selector: "mona-grid-filter-menu", inputs: { column: "column", type: "type" }, outputs: { apply: "apply" }, ngImport: i0, template: "<button monaButton [flat]=\"true\" (click)=\"openPopup()\" [ngClass]=\"{'mona-grid-filtered': column.filtered}\">\n    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n</button>\n", styles: ["button.mona-grid-filtered{color:var(--mona-primary)}button fa-icon{font-size:12px}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-filter-menu", changeDetection: ChangeDetectionStrategy.OnPush, template: "<button monaButton [flat]=\"true\" (click)=\"openPopup()\" [ngClass]=\"{'mona-grid-filtered': column.filtered}\">\n    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n</button>\n", styles: ["button.mona-grid-filtered{color:var(--mona-primary)}button fa-icon{font-size:12px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.PopupService }, { type: i0.ElementRef }, { type: i2.GridService }]; }, propDecorators: { column: [{
                type: Input
            }], apply: [{
                type: Output
            }], type: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1maWx0ZXItbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZ3JpZC9jb21wb25lbnRzL2dyaWQtZmlsdGVyLW1lbnUvZ3JpZC1maWx0ZXItbWVudS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZ3JpZC9jb21wb25lbnRzL2dyaWQtZmlsdGVyLW1lbnUvZ3JpZC1maWx0ZXItbWVudS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsdUJBQXVCLEVBRXZCLFNBQVMsRUFHVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUVuRyxPQUFPLEVBQUUsUUFBUSxFQUFrQixNQUFNLG1DQUFtQyxDQUFDO0FBSTdFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7O0FBUTFDLE1BQU0sT0FBTyx1QkFBdUI7SUFDdkIsUUFBUSxDQUFzQztJQVl2RCxZQUNxQixHQUFzQixFQUN0QixZQUEwQixFQUMxQixVQUFzQixFQUN0QixXQUF3QjtRQUh4QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUN0QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBaEJwQyxhQUFRLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdkMsZUFBVSxHQUFtQixRQUFRLENBQUM7UUFNL0MsVUFBSyxHQUFvQyxJQUFJLFlBQVksRUFBcUIsQ0FBQztRQUcvRSxTQUFJLEdBQW9CLFFBQVEsQ0FBQztJQU1yQyxDQUFDO0lBRUcsV0FBVztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTSxTQUFTO1FBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUNyQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhO1lBQ3JDLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsVUFBVSxFQUFFLHFDQUFxQztZQUNqRCxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksS0FBSyxDQUFDLGFBQWEsWUFBWSxVQUFVLEVBQUU7b0JBQzNDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBcUIsQ0FBQztvQkFDekQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7d0JBQ3ZDLE9BQU8sSUFBSSxDQUFDO3FCQUNmO2lCQUNKO2dCQUNELE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUM7U0FDSixDQUFDLENBQUM7UUFDSCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQThDLENBQUM7UUFDbEYsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNoRCxJQUFJLFdBQVcsRUFBRSxlQUFlLEVBQUU7WUFDOUIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQztTQUM3RDtRQUNELFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMvQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEQsTUFBTSxXQUFXLEdBQXNCO2dCQUNuQyxNQUFNO2dCQUNOLGVBQWUsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUs7YUFDL0MsQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sZ0JBQWdCO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN2RSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs4R0FsRVEsdUJBQXVCO2tHQUF2Qix1QkFBdUIsc0lDNUJwQywrS0FHQTs7MkZEeUJhLHVCQUF1QjtrQkFObkMsU0FBUzsrQkFDSSx1QkFBdUIsbUJBR2hCLHVCQUF1QixDQUFDLE1BQU07c0xBUXhDLE1BQU07c0JBRFosS0FBSztnQkFJQyxLQUFLO3NCQURYLE1BQU07Z0JBSUEsSUFBSTtzQkFEVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29tcG9uZW50UmVmLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0XG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQb3B1cFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vLi4vcG9wdXAvc2VydmljZXMvcG9wdXAuc2VydmljZVwiO1xuaW1wb3J0IHsgUG9wdXBSZWYgfSBmcm9tIFwiLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwUmVmXCI7XG5pbXBvcnQgeyBGaWx0ZXJNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4uLy4uLy4uL2ZpbHRlci9jb21wb25lbnRzL2ZpbHRlci1tZW51L2ZpbHRlci1tZW51LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRmlsdGVyRmllbGRUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2ZpbHRlci9tb2RlbHMvRmlsdGVyRmllbGRUeXBlXCI7XG5pbXBvcnQgeyBmYUZpbHRlciwgSWNvbkRlZmluaXRpb24gfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zXCI7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9ncmlkLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbHVtbkZpbHRlclN0YXRlIH0gZnJvbSBcIi4uLy4uL21vZGVscy9Db2x1bW5GaWx0ZXJTdGF0ZVwiO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4uLy4uL21vZGVscy9Db2x1bW5cIjtcbmltcG9ydCB7IFN1YmplY3QsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtZ3JpZC1maWx0ZXItbWVudVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vZ3JpZC1maWx0ZXItbWVudS5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9ncmlkLWZpbHRlci1tZW51LmNvbXBvbmVudC5zY3NzXCJdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRGaWx0ZXJNZW51Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHJlYWRvbmx5ICNkZXN0cm95OiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBwcml2YXRlIHBvcHVwUmVmPzogUG9wdXBSZWY7XG4gICAgcHVibGljIHJlYWRvbmx5IGZpbHRlckljb246IEljb25EZWZpbml0aW9uID0gZmFGaWx0ZXI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjb2x1bW4hOiBDb2x1bW47XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgYXBwbHk6IEV2ZW50RW1pdHRlcjxDb2x1bW5GaWx0ZXJTdGF0ZT4gPSBuZXcgRXZlbnRFbWl0dGVyPENvbHVtbkZpbHRlclN0YXRlPigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdHlwZTogRmlsdGVyRmllbGRUeXBlID0gXCJzdHJpbmdcIjtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZVxuICAgICkge31cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveS5uZXh0KCk7XG4gICAgICAgIHRoaXMuI2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0U3Vic2NyaXB0aW9ucygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuUG9wdXAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9wdXBSZWYgPSB0aGlzLnBvcHVwU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgYW5jaG9yOiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIGNvbnRlbnQ6IEZpbHRlck1lbnVDb21wb25lbnQsXG4gICAgICAgICAgICBwb3B1cENsYXNzOiBcIm1vbmEtZ3JpZC1maWx0ZXItbWVudS1wb3B1cC1jb250ZW50XCIsXG4gICAgICAgICAgICBwcmV2ZW50Q2xvc2U6IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQub3JpZ2luYWxFdmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuY2xvc2VzdChcIi5tb25hLXBvcHVwLWNvbnRlbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGZpbHRlclN0YXRlID0gdGhpcy5ncmlkU2VydmljZS5hcHBsaWVkRmlsdGVycy5nZXQodGhpcy5jb2x1bW4uZmllbGQpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnBvcHVwUmVmLmNvbXBvbmVudCBhcyBDb21wb25lbnRSZWY8RmlsdGVyTWVudUNvbXBvbmVudD47XG4gICAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS50eXBlID0gdGhpcy50eXBlO1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuZmllbGQgPSB0aGlzLmNvbHVtbi5maWVsZDtcbiAgICAgICAgaWYgKGZpbHRlclN0YXRlPy5maWx0ZXJNZW51VmFsdWUpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS52YWx1ZSA9IGZpbHRlclN0YXRlLmZpbHRlck1lbnVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuYXBwbHkucGlwZSgpLnN1YnNjcmliZShmaWx0ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyU3RhdGU6IENvbHVtbkZpbHRlclN0YXRlID0ge1xuICAgICAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgICAgICBmaWx0ZXJNZW51VmFsdWU6IGNvbXBvbmVudFJlZi5pbnN0YW5jZS52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMucG9wdXBSZWY/LmNsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLmFwcGx5LmVtaXQoZmlsdGVyU3RhdGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFN1YnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UuZmlsdGVyTG9hZCQucGlwZSh0YWtlVW50aWwodGhpcy4jZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIjxidXR0b24gbW9uYUJ1dHRvbiBbZmxhdF09XCJ0cnVlXCIgKGNsaWNrKT1cIm9wZW5Qb3B1cCgpXCIgW25nQ2xhc3NdPVwieydtb25hLWdyaWQtZmlsdGVyZWQnOiBjb2x1bW4uZmlsdGVyZWR9XCI+XG4gICAgPGZhLWljb24gW2ljb25dPVwiZmlsdGVySWNvblwiPjwvZmEtaWNvbj5cbjwvYnV0dG9uPlxuIl19