import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupAnchorDirective } from "./directives/popup-anchor.directive";
import { OverlayModule } from "@angular/cdk/overlay";
import { PopupComponent } from "./components/popup/popup.component";
import * as i0 from "@angular/core";
export class PopupModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, declarations: [PopupAnchorDirective, PopupComponent], imports: [CommonModule, OverlayModule], exports: [PopupComponent, PopupAnchorDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, imports: [CommonModule, OverlayModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PopupAnchorDirective, PopupComponent],
                    imports: [CommonModule, OverlayModule],
                    exports: [PopupComponent, PopupAnchorDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3BvcHVwL3BvcHVwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOztBQU9wRSxNQUFNLE9BQU8sV0FBVzs4R0FBWCxXQUFXOytHQUFYLFdBQVcsaUJBSkwsb0JBQW9CLEVBQUUsY0FBYyxhQUN6QyxZQUFZLEVBQUUsYUFBYSxhQUMzQixjQUFjLEVBQUUsb0JBQW9COytHQUVyQyxXQUFXLFlBSFYsWUFBWSxFQUFFLGFBQWE7OzJGQUc1QixXQUFXO2tCQUx2QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQztvQkFDcEQsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLG9CQUFvQixDQUFDO2lCQUNsRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFBvcHVwQW5jaG9yRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9wb3B1cC1hbmNob3IuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2Nkay9vdmVybGF5XCI7XG5pbXBvcnQgeyBQb3B1cENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvcG9wdXAvcG9wdXAuY29tcG9uZW50XCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbUG9wdXBBbmNob3JEaXJlY3RpdmUsIFBvcHVwQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPdmVybGF5TW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUG9wdXBDb21wb25lbnQsIFBvcHVwQW5jaG9yRGlyZWN0aXZlXVxufSlcbmV4cG9ydCBjbGFzcyBQb3B1cE1vZHVsZSB7fVxuIl19