import { Component, ContentChild, ContentChildren, Input, QueryList } from "@angular/core";
import { MenuItemComponent } from "../../../shared-menu/components/menu-item/menu-item.component";
import { v4 } from "uuid";
import { MenuTextTemplateDirective } from "../../directives/menu-text-template.directive";
import * as i0 from "@angular/core";
export class MenuComponent {
    constructor() {
        this.uid = v4();
        this.contextMenu = null;
        this.disabled = false;
        this.menuItemComponents = new QueryList();
        this.menuItems = [];
        this.text = "";
        this.textTemplate = null;
    }
    ngAfterContentInit() {
        if (this.menuItems.length > 0) {
            return;
        }
        this.createMenuItems();
        this.initializeMenuItems(this.menuItems);
        this.menuItemComponents.changes.subscribe(() => {
            this.createMenuItems();
            this.initializeMenuItems(this.menuItems);
        });
    }
    ngOnInit() { }
    createMenuItems() {
        this.menuItems = this.menuItemComponents.map(i => i.getMenuItem());
    }
    initializeMenuItems(items) {
        items.forEach(i => {
            i.visible = i.visible !== false;
            this.initializeMenuItems(i.subMenuItems ?? []);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MenuComponent, selector: "mona-menu", inputs: { disabled: "disabled", menuItems: "menuItems", text: "text" }, queries: [{ propertyName: "textTemplate", first: true, predicate: MenuTextTemplateDirective, descendants: true }, { propertyName: "menuItemComponents", predicate: MenuItemComponent }], ngImport: i0, template: "", isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-menu", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { disabled: [{
                type: Input
            }], menuItemComponents: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], menuItems: [{
                type: Input
            }], text: [{
                type: Input
            }], textTemplate: [{
                type: ContentChild,
                args: [MenuTextTemplateDirective]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvbWVudXMvbW9kdWxlcy9tZW51YmFyL2NvbXBvbmVudHMvbWVudS9tZW51LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQW9CLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDbEcsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUxQixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQzs7QUFPMUYsTUFBTSxPQUFPLGFBQWE7SUFtQnRCO1FBbEJnQixRQUFHLEdBQVcsRUFBRSxFQUFFLENBQUM7UUFDNUIsZ0JBQVcsR0FBZ0MsSUFBSSxDQUFDO1FBR2hELGFBQVEsR0FBWSxLQUFLLENBQUM7UUFHMUIsdUJBQWtCLEdBQWlDLElBQUksU0FBUyxFQUFxQixDQUFDO1FBR3RGLGNBQVMsR0FBZSxFQUFFLENBQUM7UUFHM0IsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUdsQixpQkFBWSxHQUFxQyxJQUFJLENBQUM7SUFFdkMsQ0FBQztJQUVoQixrQkFBa0I7UUFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0IsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzNDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLFFBQVEsS0FBVSxDQUFDO0lBRWxCLGVBQWU7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEtBQWlCO1FBQ3pDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZCxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs4R0E1Q1EsYUFBYTtrR0FBYixhQUFhLG1LQWdCUix5QkFBeUIsd0VBVHRCLGlCQUFpQiw2QkFWeEIsRUFBRTs7MkZBR0gsYUFBYTtrQkFMekIsU0FBUzsrQkFDSSxXQUFXLFlBQ1gsRUFBRTswRUFRTCxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsa0JBQWtCO3NCQUR4QixlQUFlO3VCQUFDLGlCQUFpQjtnQkFJM0IsU0FBUztzQkFEZixLQUFLO2dCQUlDLElBQUk7c0JBRFYsS0FBSztnQkFJQyxZQUFZO3NCQURsQixZQUFZO3VCQUFDLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBDb250ZW50Q2hpbGRyZW4sIElucHV0LCBPbkluaXQsIFF1ZXJ5TGlzdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBNZW51SXRlbSB9IGZyb20gXCIuLi8uLi8uLi9jb250ZXh0LW1lbnUvbW9kZWxzL01lbnVJdGVtXCI7XG5pbXBvcnQgeyBNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gXCIuLi8uLi8uLi9zaGFyZWQtbWVudS9jb21wb25lbnRzL21lbnUtaXRlbS9tZW51LWl0ZW0uY29tcG9uZW50XCI7XG5pbXBvcnQgeyB2NCB9IGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudUNvbXBvbmVudCB9IGZyb20gXCIuLi8uLi8uLi9jb250ZXh0LW1lbnUvY29tcG9uZW50cy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWVudVRleHRUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL21lbnUtdGV4dC10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1tZW51XCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgc3R5bGVVcmxzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBNZW51Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0IHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgdWlkOiBzdHJpbmcgPSB2NCgpO1xuICAgIHB1YmxpYyBjb250ZXh0TWVudTogQ29udGV4dE1lbnVDb21wb25lbnQgfCBudWxsID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKE1lbnVJdGVtQ29tcG9uZW50KVxuICAgIHB1YmxpYyBtZW51SXRlbUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxNZW51SXRlbUNvbXBvbmVudD4gPSBuZXcgUXVlcnlMaXN0PE1lbnVJdGVtQ29tcG9uZW50PigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWVudUl0ZW1zOiBNZW51SXRlbVtdID0gW107XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgQENvbnRlbnRDaGlsZChNZW51VGV4dFRlbXBsYXRlRGlyZWN0aXZlKVxuICAgIHB1YmxpYyB0ZXh0VGVtcGxhdGU6IE1lbnVUZXh0VGVtcGxhdGVEaXJlY3RpdmUgfCBudWxsID0gbnVsbDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5tZW51SXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlTWVudUl0ZW1zKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU1lbnVJdGVtcyh0aGlzLm1lbnVJdGVtcyk7XG4gICAgICAgIHRoaXMubWVudUl0ZW1Db21wb25lbnRzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTWVudUl0ZW1zKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVNZW51SXRlbXModGhpcy5tZW51SXRlbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVNZW51SXRlbXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWVudUl0ZW1zID0gdGhpcy5tZW51SXRlbUNvbXBvbmVudHMubWFwKGkgPT4gaS5nZXRNZW51SXRlbSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVNZW51SXRlbXMoaXRlbXM6IE1lbnVJdGVtW10pOiB2b2lkIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgIGkudmlzaWJsZSA9IGkudmlzaWJsZSAhPT0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVNZW51SXRlbXMoaS5zdWJNZW51SXRlbXMgPz8gW10pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=