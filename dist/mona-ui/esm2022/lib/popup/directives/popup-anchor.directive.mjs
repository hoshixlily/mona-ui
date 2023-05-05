import { Directive } from "@angular/core";
import { PopupService } from "../services/popup.service";
import * as i0 from "@angular/core";
export class PopupAnchorDirective {
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
        PopupService.popupAnchorDirective = this;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupAnchorDirective, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: PopupAnchorDirective, selector: "[monaPopupAnchor]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupAnchorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaPopupAnchor]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAtYW5jaG9yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9wb3B1cC9kaXJlY3RpdmVzL3BvcHVwLWFuY2hvci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUt6RCxNQUFNLE9BQU8sb0JBQW9CO0lBQzdCLFlBQW1DLGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2pFLFlBQVksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDN0MsQ0FBQzs4R0FIUSxvQkFBb0I7a0dBQXBCLG9CQUFvQjs7MkZBQXBCLG9CQUFvQjtrQkFIaEMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2lCQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQb3B1cFNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvcG9wdXAuc2VydmljZVwiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJbbW9uYVBvcHVwQW5jaG9yXVwiXG59KVxuZXhwb3J0IGNsYXNzIFBvcHVwQW5jaG9yRGlyZWN0aXZlIHtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICAgICAgUG9wdXBTZXJ2aWNlLnBvcHVwQW5jaG9yRGlyZWN0aXZlID0gdGhpcztcbiAgICB9XG59XG4iXX0=