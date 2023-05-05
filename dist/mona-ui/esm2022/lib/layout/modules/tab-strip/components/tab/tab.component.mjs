import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { TabContentTemplateDirective } from "../../directives/tab-content-template.directive";
import { TabTitleTemplateDirective } from "../../directives/tab-title-template.directive";
import { v4 } from "uuid";
import * as i0 from "@angular/core";
export class TabComponent {
    constructor() {
        this.uid = v4();
        this.index = 0;
        this.contentTemplate = null;
        this.disabled = false;
        this.selected = false;
        this.title = "";
        this.titleTemplate = null;
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TabComponent, selector: "mona-tab", inputs: { closable: "closable", disabled: "disabled", selected: "selected", title: "title" }, queries: [{ propertyName: "contentTemplate", first: true, predicate: TabContentTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "titleTemplate", first: true, predicate: TabTitleTemplateDirective, descendants: true, read: TemplateRef }], ngImport: i0, template: "", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tab", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { closable: [{
                type: Input
            }], contentTemplate: [{
                type: ContentChild,
                args: [TabContentTemplateDirective, { read: TemplateRef }]
            }], disabled: [{
                type: Input
            }], selected: [{
                type: Input
            }], title: [{
                type: Input
            }], titleTemplate: [{
                type: ContentChild,
                args: [TabTitleTemplateDirective, { read: TemplateRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9sYXlvdXQvbW9kdWxlcy90YWItc3RyaXAvY29tcG9uZW50cy90YWIvdGFiLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9sYXlvdXQvbW9kdWxlcy90YWItc3RyaXAvY29tcG9uZW50cy90YWIvdGFiLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDOUYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDMUYsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFPMUIsTUFBTSxPQUFPLFlBQVk7SUFzQnJCO1FBckJnQixRQUFHLEdBQVcsRUFBRSxFQUFFLENBQUM7UUFDNUIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQU1sQixvQkFBZSxHQUE0QixJQUFJLENBQUM7UUFHaEQsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUcxQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRzFCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFHbkIsa0JBQWEsR0FBNEIsSUFBSSxDQUFDO0lBRS9CLENBQUM7SUFFaEIsUUFBUSxLQUFVLENBQUM7OEdBeEJqQixZQUFZO2tHQUFaLFlBQVksMkxBT1AsMkJBQTJCLDJCQUFVLFdBQVcsNkRBWWhELHlCQUF5QiwyQkFBVSxXQUFXLDZCQzdCaEUsRUFBQTs7MkZEVWEsWUFBWTtrQkFMeEIsU0FBUzsrQkFDSSxVQUFVOzBFQVNiLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxlQUFlO3NCQURyQixZQUFZO3VCQUFDLDJCQUEyQixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFJekQsUUFBUTtzQkFEZCxLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxLQUFLO3NCQURYLEtBQUs7Z0JBSUMsYUFBYTtzQkFEbkIsWUFBWTt1QkFBQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgVGFiQ29udGVudFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvdGFiLWNvbnRlbnQtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBUYWJUaXRsZVRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvdGFiLXRpdGxlLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgdjQgfSBmcm9tIFwidXVpZFwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLXRhYlwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vdGFiLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL3RhYi5jb21wb25lbnQuc2Nzc1wiXVxufSlcbmV4cG9ydCBjbGFzcyBUYWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHB1YmxpYyByZWFkb25seSB1aWQ6IHN0cmluZyA9IHY0KCk7XG4gICAgcHVibGljIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2xvc2FibGU/OiBib29sZWFuO1xuXG4gICAgQENvbnRlbnRDaGlsZChUYWJDb250ZW50VGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgQENvbnRlbnRDaGlsZChUYWJUaXRsZVRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIHRpdGxlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7fVxufVxuIiwiIl19