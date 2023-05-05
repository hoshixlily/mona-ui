import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuItemTextTemplateDirective } from "./directives/menu-item-text-template.directive";
import { MenuItemIconTemplateDirective } from "./directives/menu-item-icon-template.directive";
import { PopupModule } from "../../../popup/popup.module";
import * as i0 from "@angular/core";
export class SharedMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, declarations: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective], imports: [CommonModule, PopupModule], exports: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, imports: [CommonModule, PopupModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective],
                    imports: [CommonModule, PopupModule],
                    exports: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLW1lbnUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL21lbnVzL21vZHVsZXMvc2hhcmVkLW1lbnUvc2hhcmVkLW1lbnUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQy9FLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFPMUQsTUFBTSxPQUFPLGdCQUFnQjs4R0FBaEIsZ0JBQWdCOytHQUFoQixnQkFBZ0IsaUJBSlYsaUJBQWlCLEVBQUUsNkJBQTZCLEVBQUUsNkJBQTZCLGFBQ3BGLFlBQVksRUFBRSxXQUFXLGFBQ3pCLGlCQUFpQixFQUFFLDZCQUE2QixFQUFFLDZCQUE2QjsrR0FFaEYsZ0JBQWdCLFlBSGYsWUFBWSxFQUFFLFdBQVc7OzJGQUcxQixnQkFBZ0I7a0JBTDVCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsNkJBQTZCLEVBQUUsNkJBQTZCLENBQUM7b0JBQy9GLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7b0JBQ3BDLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLDZCQUE2QixFQUFFLDZCQUE2QixDQUFDO2lCQUM3RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IE1lbnVJdGVtQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9tZW51LWl0ZW0vbWVudS1pdGVtLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWVudUl0ZW1UZXh0VGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL21lbnUtaXRlbS10ZXh0LXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgTWVudUl0ZW1JY29uVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL21lbnUtaXRlbS1pY29uLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgUG9wdXBNb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vcG9wdXAvcG9wdXAubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbTWVudUl0ZW1Db21wb25lbnQsIE1lbnVJdGVtVGV4dFRlbXBsYXRlRGlyZWN0aXZlLCBNZW51SXRlbUljb25UZW1wbGF0ZURpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUG9wdXBNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtNZW51SXRlbUNvbXBvbmVudCwgTWVudUl0ZW1UZXh0VGVtcGxhdGVEaXJlY3RpdmUsIE1lbnVJdGVtSWNvblRlbXBsYXRlRGlyZWN0aXZlXVxufSlcbmV4cG9ydCBjbGFzcyBTaGFyZWRNZW51TW9kdWxlIHt9XG4iXX0=