import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WindowContentComponent } from "./components/window-content/window-content.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { WindowResizeHandlerDirective } from "./directives/window-resize-handler.directive";
import { WindowDragHandlerDirective } from "./directives/window-drag-handler.directive";
import { WindowComponent } from "./components/window/window.component";
import { WindowTitleTemplateDirective } from "./directives/window-title-template.directive";
import * as i0 from "@angular/core";
export class WindowModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, declarations: [WindowContentComponent,
            WindowResizeHandlerDirective,
            WindowDragHandlerDirective,
            WindowComponent,
            WindowTitleTemplateDirective], imports: [CommonModule, ButtonModule, FontAwesomeModule], exports: [WindowComponent, WindowTitleTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, imports: [CommonModule, ButtonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        WindowContentComponent,
                        WindowResizeHandlerDirective,
                        WindowDragHandlerDirective,
                        WindowComponent,
                        WindowTitleTemplateDirective
                    ],
                    imports: [CommonModule, ButtonModule, FontAwesomeModule],
                    exports: [WindowComponent, WindowTitleTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi93aW5kb3cvd2luZG93Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM5RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDNUYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDeEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOztBQWE1RixNQUFNLE9BQU8sWUFBWTs4R0FBWixZQUFZOytHQUFaLFlBQVksaUJBVGpCLHNCQUFzQjtZQUN0Qiw0QkFBNEI7WUFDNUIsMEJBQTBCO1lBQzFCLGVBQWU7WUFDZiw0QkFBNEIsYUFFdEIsWUFBWSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsYUFDN0MsZUFBZSxFQUFFLDRCQUE0QjsrR0FFOUMsWUFBWSxZQUhYLFlBQVksRUFBRSxZQUFZLEVBQUUsaUJBQWlCOzsyRkFHOUMsWUFBWTtrQkFYeEIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysc0JBQXNCO3dCQUN0Qiw0QkFBNEI7d0JBQzVCLDBCQUEwQjt3QkFDMUIsZUFBZTt3QkFDZiw0QkFBNEI7cUJBQy9CO29CQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsaUJBQWlCLENBQUM7b0JBQ3hELE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSw0QkFBNEIsQ0FBQztpQkFDM0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBXaW5kb3dDb250ZW50Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy93aW5kb3ctY29udGVudC93aW5kb3ctY29udGVudC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuLi9idXR0b25zL21vZHVsZXMvYnV0dG9uL2J1dHRvbi5tb2R1bGVcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBXaW5kb3dSZXNpemVIYW5kbGVyRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy93aW5kb3ctcmVzaXplLWhhbmRsZXIuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBXaW5kb3dEcmFnSGFuZGxlckRpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvd2luZG93LWRyYWctaGFuZGxlci5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IFdpbmRvd0NvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvd2luZG93L3dpbmRvdy5jb21wb25lbnRcIjtcbmltcG9ydCB7IFdpbmRvd1RpdGxlVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3dpbmRvdy10aXRsZS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgV2luZG93Q29udGVudENvbXBvbmVudCxcbiAgICAgICAgV2luZG93UmVzaXplSGFuZGxlckRpcmVjdGl2ZSxcbiAgICAgICAgV2luZG93RHJhZ0hhbmRsZXJEaXJlY3RpdmUsXG4gICAgICAgIFdpbmRvd0NvbXBvbmVudCxcbiAgICAgICAgV2luZG93VGl0bGVUZW1wbGF0ZURpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQnV0dG9uTW9kdWxlLCBGb250QXdlc29tZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW1dpbmRvd0NvbXBvbmVudCwgV2luZG93VGl0bGVUZW1wbGF0ZURpcmVjdGl2ZV1cbn0pXG5leHBvcnQgY2xhc3MgV2luZG93TW9kdWxlIHt9XG4iXX0=