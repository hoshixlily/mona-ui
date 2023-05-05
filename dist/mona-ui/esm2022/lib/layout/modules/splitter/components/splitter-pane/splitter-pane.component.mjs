import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { v4 } from "uuid";
import * as i0 from "@angular/core";
export class SplitterPaneComponent {
    set size(size) {
        this.paneSize = size == null ? undefined : typeof size === "string" ? size : `${size}px`;
        this.isStatic = true;
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.uid = v4();
        this.isStatic = false;
        this.collapsed = false;
        this.collapsedChange = new EventEmitter();
        this.collapsible = false;
        this.resizable = true;
        this.sizeChange = new EventEmitter();
        this.templateRef = null;
    }
    ngOnInit() { }
    setCollapsed(collapsed) {
        this.collapsed = collapsed;
        this.collapsedChange.emit(collapsed);
    }
    setSize(size) {
        this.paneSize = size == null ? size : typeof size === "string" ? size : `${size}px`;
        this.sizeChange.emit(this.paneSize);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterPaneComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SplitterPaneComponent, selector: "mona-splitter-pane", inputs: { collapsed: "collapsed", collapsible: "collapsible", element: "element", resizable: "resizable", size: "size" }, outputs: { collapsedChange: "collapsedChange", sizeChange: "sizeChange" }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: "<ng-template>\n    <ng-content></ng-content>\n</ng-template>\n", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterPaneComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-splitter-pane", template: "<ng-template>\n    <ng-content></ng-content>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { collapsed: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], collapsible: [{
                type: Input
            }], element: [{
                type: Input
            }], resizable: [{
                type: Input
            }], size: [{
                type: Input
            }], sizeChange: [{
                type: Output
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXItcGFuZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvbGF5b3V0L21vZHVsZXMvc3BsaXR0ZXIvY29tcG9uZW50cy9zcGxpdHRlci1wYW5lL3NwbGl0dGVyLXBhbmUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2xheW91dC9tb2R1bGVzL3NwbGl0dGVyL2NvbXBvbmVudHMvc3BsaXR0ZXItcGFuZS9zcGxpdHRlci1wYW5lLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuSCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQU8xQixNQUFNLE9BQU8scUJBQXFCO0lBb0I5QixJQUNXLElBQUksQ0FBQyxJQUFpQztRQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUM7UUFDekYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQVFELFlBQW1DLFVBQW1DO1FBQW5DLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBL0J0RCxRQUFHLEdBQVcsRUFBRSxFQUFFLENBQUM7UUFFNUIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUdqQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBRzNCLG9CQUFlLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFHckUsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFNN0IsY0FBUyxHQUFZLElBQUksQ0FBQztRQVMxQixlQUFVLEdBQXFDLElBQUksWUFBWSxFQUFzQixDQUFDO1FBR3RGLGdCQUFXLEdBQThCLElBQUksQ0FBQztJQUVvQixDQUFDO0lBRW5FLFFBQVEsS0FBVSxDQUFDO0lBRW5CLFlBQVksQ0FBQyxTQUFrQjtRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sT0FBTyxDQUFDLElBQWlDO1FBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQztRQUNwRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs4R0E1Q1EscUJBQXFCO2tHQUFyQixxQkFBcUIsNFNBNkJuQixXQUFXLGdEQ3JDMUIsZ0VBR0E7OzJGREthLHFCQUFxQjtrQkFMakMsU0FBUzsrQkFDSSxvQkFBb0I7aUdBVXZCLFNBQVM7c0JBRGYsS0FBSztnQkFJQyxlQUFlO3NCQURyQixNQUFNO2dCQUlBLFdBQVc7c0JBRGpCLEtBQUs7Z0JBSUMsT0FBTztzQkFEYixLQUFLO2dCQUlDLFNBQVM7c0JBRGYsS0FBSztnQkFJSyxJQUFJO3NCQURkLEtBQUs7Z0JBT0MsVUFBVTtzQkFEaEIsTUFBTTtnQkFJQSxXQUFXO3NCQURqQixTQUFTO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IHY0IH0gZnJvbSBcInV1aWRcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1zcGxpdHRlci1wYW5lXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9zcGxpdHRlci1wYW5lLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL3NwbGl0dGVyLXBhbmUuY29tcG9uZW50LnNjc3NcIl1cbn0pXG5leHBvcnQgY2xhc3MgU3BsaXR0ZXJQYW5lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgdWlkOiBzdHJpbmcgPSB2NCgpO1xuICAgIHB1YmxpYyBwYW5lU2l6ZT86IHN0cmluZztcbiAgICBwdWJsaWMgaXNTdGF0aWMgPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbGxhcHNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbGxhcHNlZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY29sbGFwc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGVsZW1lbnQhOiBIVE1MRGl2RWxlbWVudDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJlc2l6YWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgc2l6ZShzaXplOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5wYW5lU2l6ZSA9IHNpemUgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IHR5cGVvZiBzaXplID09PSBcInN0cmluZ1wiID8gc2l6ZSA6IGAke3NpemV9cHhgO1xuICAgICAgICB0aGlzLmlzU3RhdGljID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2l6ZUNoYW5nZTogRXZlbnRFbWl0dGVyPHN0cmluZyB8IHVuZGVmaW5lZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZyB8IHVuZGVmaW5lZD4oKTtcblxuICAgIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpXG4gICAgcHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxuZXZlcj4gfCBudWxsID0gbnVsbDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gICAgcHVibGljIHNldENvbGxhcHNlZChjb2xsYXBzZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xsYXBzZWQgPSBjb2xsYXBzZWQ7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkQ2hhbmdlLmVtaXQoY29sbGFwc2VkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U2l6ZShzaXplOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYW5lU2l6ZSA9IHNpemUgPT0gbnVsbCA/IHNpemUgOiB0eXBlb2Ygc2l6ZSA9PT0gXCJzdHJpbmdcIiA/IHNpemUgOiBgJHtzaXplfXB4YDtcbiAgICAgICAgdGhpcy5zaXplQ2hhbmdlLmVtaXQodGhpcy5wYW5lU2l6ZSk7XG4gICAgfVxufVxuIiwiPG5nLXRlbXBsYXRlPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG4iXX0=