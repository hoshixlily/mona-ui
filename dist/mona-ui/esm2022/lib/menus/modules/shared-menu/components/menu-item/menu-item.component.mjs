import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { MenuItemTextTemplateDirective } from "../../directives/menu-item-text-template.directive";
import { MenuItemIconTemplateDirective } from "../../directives/menu-item-icon-template.directive";
import * as i0 from "@angular/core";
export class MenuItemComponent {
    set data(data) {
        this.menuItem.data = data;
    }
    set disabled(disabled) {
        this.menuItem.disabled = disabled;
    }
    set divider(divider) {
        this.menuItem.divider = divider;
    }
    set iconClass(iconClass) {
        this.menuItem.iconClass = iconClass;
    }
    set text(text) {
        this.menuItem.text = text;
    }
    set visible(visible) {
        this.menuItem.visible = visible;
    }
    constructor() {
        this.componentDestroy$ = new Subject();
        this.menuItem = {
            disabled: false,
            divider: false,
            parent: null,
            subMenuItems: [],
            text: "",
            visible: true
        };
        this.iconTemplate = new QueryList();
        this.menuClick = new EventEmitter();
        this.submenuItems = new QueryList();
        this.textTemplate = new QueryList();
    }
    getMenuItem() {
        return this.getMenuItemWithDepth(0);
    }
    ngAfterContentInit() {
        this.submenuItems.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.menuItem.subMenuItems = this.submenuItems.map(si => si.getMenuItem());
        });
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.unsubscribe();
    }
    ngOnInit() { }
    getMenuItemWithDepth(depth = 0) {
        this.menuItem.iconTemplate = this.iconTemplate.get(0);
        this.menuItem.menuClick = () => this.menuClick.emit();
        this.menuItem.subMenuItems = this.submenuItems.map(si => {
            const subMenuItem = si.getMenuItemWithDepth(depth + 1);
            subMenuItem.parent = this.menuItem;
            return subMenuItem;
        });
        this.menuItem.depth = depth;
        this.menuItem.textTemplate = this.textTemplate.get(0);
        return this.menuItem;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MenuItemComponent, selector: "mona-menu-item", inputs: { data: "data", disabled: "disabled", divider: "divider", iconClass: "iconClass", text: "text", visible: "visible" }, outputs: { menuClick: "menuClick" }, queries: [{ propertyName: "iconTemplate", predicate: MenuItemIconTemplateDirective, read: TemplateRef }, { propertyName: "submenuItems", predicate: MenuItemComponent }, { propertyName: "textTemplate", predicate: MenuItemTextTemplateDirective, read: TemplateRef }], ngImport: i0, template: "", isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-menu-item", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { data: [{
                type: Input
            }], disabled: [{
                type: Input
            }], divider: [{
                type: Input
            }], iconClass: [{
                type: Input
            }], iconTemplate: [{
                type: ContentChildren,
                args: [MenuItemIconTemplateDirective, { read: TemplateRef, descendants: false }]
            }], menuClick: [{
                type: Output
            }], submenuItems: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], text: [{
                type: Input
            }], textTemplate: [{
                type: ContentChildren,
                args: [MenuItemTextTemplateDirective, { read: TemplateRef, descendants: false }]
            }], visible: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9tZW51cy9tb2R1bGVzL3NoYXJlZC1tZW51L2NvbXBvbmVudHMvbWVudS1pdGVtL21lbnUtaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILFNBQVMsRUFDVCxlQUFlLEVBQ2YsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDZCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNuRyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQzs7QUFPbkcsTUFBTSxPQUFPLGlCQUFpQjtJQVcxQixJQUNXLElBQUksQ0FBQyxJQUFhO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFDVyxRQUFRLENBQUMsUUFBaUI7UUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUNXLE9BQU8sQ0FBQyxPQUFnQjtRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQWEsU0FBUyxDQUFDLFNBQWlCO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUN4QyxDQUFDO0lBV0QsSUFDVyxJQUFJLENBQUMsSUFBWTtRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDOUIsQ0FBQztJ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QUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFO2dCQUlsRixTQUFTO3NCQURmLE1BQU07Z0JBSUEsWUFBWTtzQkFEbEIsZUFBZTt1QkFBQyxpQkFBaUI7Z0JBSXZCLElBQUk7c0JBRGQsS0FBSztnQkFNQyxZQUFZO3NCQURsQixlQUFlO3VCQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFO2dCQUk5RSxPQUFPO3NCQURqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0LFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBUZW1wbGF0ZVJlZlxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tIFwiLi4vLi4vLi4vY29udGV4dC1tZW51L21vZGVscy9NZW51SXRlbVwiO1xuaW1wb3J0IHsgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IE1lbnVJdGVtVGV4dFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvbWVudS1pdGVtLXRleHQtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBNZW51SXRlbUljb25UZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL21lbnUtaXRlbS1pY29uLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLW1lbnUtaXRlbVwiLFxuICAgIHRlbXBsYXRlOiBcIlwiLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgTWVudUl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnREZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSBtZW51SXRlbTogTWVudUl0ZW0gPSB7XG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgZGl2aWRlcjogZmFsc2UsXG4gICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgc3ViTWVudUl0ZW1zOiBbXSxcbiAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgIH07XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZGF0YShkYXRhOiB1bmtub3duKSB7XG4gICAgICAgIHRoaXMubWVudUl0ZW0uZGF0YSA9IGRhdGE7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGRpc2FibGVkKGRpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMubWVudUl0ZW0uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZGl2aWRlcihkaXZpZGVyOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMubWVudUl0ZW0uZGl2aWRlciA9IGRpdmlkZXI7XG4gICAgfVxuXG4gICAgQElucHV0KCkgc2V0IGljb25DbGFzcyhpY29uQ2xhc3M6IHN0cmluZykge1xuICAgICAgICB0aGlzLm1lbnVJdGVtLmljb25DbGFzcyA9IGljb25DbGFzcztcbiAgICB9XG5cbiAgICBAQ29udGVudENoaWxkcmVuKE1lbnVJdGVtSWNvblRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgaWNvblRlbXBsYXRlOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj4gPSBuZXcgUXVlcnlMaXN0PFRlbXBsYXRlUmVmPGFueT4+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbWVudUNsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKE1lbnVJdGVtQ29tcG9uZW50KVxuICAgIHB1YmxpYyBzdWJtZW51SXRlbXM6IFF1ZXJ5TGlzdDxNZW51SXRlbUNvbXBvbmVudD4gPSBuZXcgUXVlcnlMaXN0PE1lbnVJdGVtQ29tcG9uZW50PigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubWVudUl0ZW0udGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgQENvbnRlbnRDaGlsZHJlbihNZW51SXRlbVRleHRUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgZGVzY2VuZGFudHM6IGZhbHNlIH0pXG4gICAgcHVibGljIHRleHRUZW1wbGF0ZTogUXVlcnlMaXN0PFRlbXBsYXRlUmVmPGFueT4+ID0gbmV3IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHZpc2libGUodmlzaWJsZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLm1lbnVJdGVtLnZpc2libGUgPSB2aXNpYmxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgZ2V0TWVudUl0ZW0oKTogTWVudUl0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNZW51SXRlbVdpdGhEZXB0aCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1Ym1lbnVJdGVtcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tZW51SXRlbS5zdWJNZW51SXRlbXMgPSB0aGlzLnN1Ym1lbnVJdGVtcy5tYXAoc2kgPT4gc2kuZ2V0TWVudUl0ZW0oKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gICAgcHJpdmF0ZSBnZXRNZW51SXRlbVdpdGhEZXB0aChkZXB0aDogbnVtYmVyID0gMCk6IE1lbnVJdGVtIHtcbiAgICAgICAgdGhpcy5tZW51SXRlbS5pY29uVGVtcGxhdGUgPSB0aGlzLmljb25UZW1wbGF0ZS5nZXQoMCk7XG4gICAgICAgIHRoaXMubWVudUl0ZW0ubWVudUNsaWNrID0gKCk6IHZvaWQgPT4gdGhpcy5tZW51Q2xpY2suZW1pdCgpO1xuICAgICAgICB0aGlzLm1lbnVJdGVtLnN1Yk1lbnVJdGVtcyA9IHRoaXMuc3VibWVudUl0ZW1zLm1hcChzaSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJNZW51SXRlbSA9IHNpLmdldE1lbnVJdGVtV2l0aERlcHRoKGRlcHRoICsgMSk7XG4gICAgICAgICAgICBzdWJNZW51SXRlbS5wYXJlbnQgPSB0aGlzLm1lbnVJdGVtO1xuICAgICAgICAgICAgcmV0dXJuIHN1Yk1lbnVJdGVtO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tZW51SXRlbS5kZXB0aCA9IGRlcHRoO1xuICAgICAgICB0aGlzLm1lbnVJdGVtLnRleHRUZW1wbGF0ZSA9IHRoaXMudGV4dFRlbXBsYXRlLmdldCgwKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVudUl0ZW07XG4gICAgfVxufVxuIl19