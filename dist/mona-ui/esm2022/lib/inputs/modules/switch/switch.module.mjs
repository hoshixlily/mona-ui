import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SwitchComponent } from "./components/switch/switch.component";
import { SwitchOffLabelTemplateDirective } from "./directives/switch-off-label-template.directive";
import { SwitchOnLabelTemplateDirective } from "./directives/switch-on-label-template.directive";
import * as i0 from "@angular/core";
export class SwitchModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, declarations: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective], imports: [CommonModule], exports: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective],
                    imports: [CommonModule],
                    exports: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9zd2l0Y2gvc3dpdGNoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDbkcsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saURBQWlELENBQUM7O0FBT2pHLE1BQU0sT0FBTyxZQUFZOzhHQUFaLFlBQVk7K0dBQVosWUFBWSxpQkFKTixlQUFlLEVBQUUsK0JBQStCLEVBQUUsOEJBQThCLGFBQ3JGLFlBQVksYUFDWixlQUFlLEVBQUUsK0JBQStCLEVBQUUsOEJBQThCOytHQUVqRixZQUFZLFlBSFgsWUFBWTs7MkZBR2IsWUFBWTtrQkFMeEIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsK0JBQStCLEVBQUUsOEJBQThCLENBQUM7b0JBQ2hHLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLCtCQUErQixFQUFFLDhCQUE4QixDQUFDO2lCQUM5RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFN3aXRjaENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvc3dpdGNoL3N3aXRjaC5jb21wb25lbnRcIjtcbmltcG9ydCB7IFN3aXRjaE9mZkxhYmVsVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3N3aXRjaC1vZmYtbGFiZWwtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBTd2l0Y2hPbkxhYmVsVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3N3aXRjaC1vbi1sYWJlbC10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtTd2l0Y2hDb21wb25lbnQsIFN3aXRjaE9mZkxhYmVsVGVtcGxhdGVEaXJlY3RpdmUsIFN3aXRjaE9uTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1N3aXRjaENvbXBvbmVudCwgU3dpdGNoT2ZmTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSwgU3dpdGNoT25MYWJlbFRlbXBsYXRlRGlyZWN0aXZlXVxufSlcbmV4cG9ydCBjbGFzcyBTd2l0Y2hNb2R1bGUge31cbiJdfQ==