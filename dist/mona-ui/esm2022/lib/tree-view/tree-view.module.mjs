import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewComponent } from "./components/tree-view/tree-view.component";
import { TreeViewNodeComponent } from "./components/tree-view-node/tree-view-node.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CheckBoxModule } from "../inputs/modules/check-box/check-box.module";
import { FormsModule } from "@angular/forms";
import { TreeViewCheckableDirective } from "./directives/tree-view-checkable.directive";
import { TreeViewNodeTextTemplateDirective } from "./directives/tree-view-node-text-template.directive";
import { TreeViewExpandableDirective } from "./directives/tree-view-expandable.directive";
import { TreeViewSelectableDirective } from "./directives/tree-view-selectable.directive";
import { ContextMenuModule } from "../menus/modules/context-menu/context-menu.module";
import { TreeViewDisableDirective } from "./directives/tree-view-disable.directive";
import { DragDropModule } from "@angular/cdk/drag-drop";
import * as i0 from "@angular/core";
export class TreeViewModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, declarations: [TreeViewComponent,
            TreeViewNodeComponent,
            TreeViewCheckableDirective,
            TreeViewNodeTextTemplateDirective,
            TreeViewExpandableDirective,
            TreeViewSelectableDirective,
            TreeViewDisableDirective], imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule], exports: [TreeViewComponent,
            TreeViewCheckableDirective,
            TreeViewNodeTextTemplateDirective,
            TreeViewExpandableDirective,
            TreeViewSelectableDirective,
            TreeViewDisableDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        TreeViewComponent,
                        TreeViewNodeComponent,
                        TreeViewCheckableDirective,
                        TreeViewNodeTextTemplateDirective,
                        TreeViewExpandableDirective,
                        TreeViewSelectableDirective,
                        TreeViewDisableDirective
                    ],
                    imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule],
                    exports: [
                        TreeViewComponent,
                        TreeViewCheckableDirective,
                        TreeViewNodeTextTemplateDirective,
                        TreeViewExpandableDirective,
                        TreeViewSelectableDirective,
                        TreeViewDisableDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi90cmVlLXZpZXcvdHJlZS12aWV3Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMvRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM3RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3hHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzFGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzFGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFzQnhELE1BQU0sT0FBTyxjQUFjOzhHQUFkLGNBQWM7K0dBQWQsY0FBYyxpQkFsQm5CLGlCQUFpQjtZQUNqQixxQkFBcUI7WUFDckIsMEJBQTBCO1lBQzFCLGlDQUFpQztZQUNqQywyQkFBMkI7WUFDM0IsMkJBQTJCO1lBQzNCLHdCQUF3QixhQUVsQixZQUFZLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLGFBRXJHLGlCQUFpQjtZQUNqQiwwQkFBMEI7WUFDMUIsaUNBQWlDO1lBQ2pDLDJCQUEyQjtZQUMzQiwyQkFBMkI7WUFDM0Isd0JBQXdCOytHQUduQixjQUFjLFlBVmIsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsY0FBYzs7MkZBVWhHLGNBQWM7a0JBcEIxQixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixpQkFBaUI7d0JBQ2pCLHFCQUFxQjt3QkFDckIsMEJBQTBCO3dCQUMxQixpQ0FBaUM7d0JBQ2pDLDJCQUEyQjt3QkFDM0IsMkJBQTJCO3dCQUMzQix3QkFBd0I7cUJBQzNCO29CQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztvQkFDMUcsT0FBTyxFQUFFO3dCQUNMLGlCQUFpQjt3QkFDakIsMEJBQTBCO3dCQUMxQixpQ0FBaUM7d0JBQ2pDLDJCQUEyQjt3QkFDM0IsMkJBQTJCO3dCQUMzQix3QkFBd0I7cUJBQzNCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgVHJlZVZpZXdDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyZWUtdmlldy90cmVlLXZpZXcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUcmVlVmlld05vZGVDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyZWUtdmlldy1ub2RlL3RyZWUtdmlldy1ub2RlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRm9udEF3ZXNvbWVNb2R1bGUgfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWVcIjtcbmltcG9ydCB7IENoZWNrQm94TW9kdWxlIH0gZnJvbSBcIi4uL2lucHV0cy9tb2R1bGVzL2NoZWNrLWJveC9jaGVjay1ib3gubW9kdWxlXCI7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgVHJlZVZpZXdDaGVja2FibGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3RyZWUtdmlldy1jaGVja2FibGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBUcmVlVmlld05vZGVUZXh0VGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3RyZWUtdmlldy1ub2RlLXRleHQtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBUcmVlVmlld0V4cGFuZGFibGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3RyZWUtdmlldy1leHBhbmRhYmxlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgVHJlZVZpZXdTZWxlY3RhYmxlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy90cmVlLXZpZXctc2VsZWN0YWJsZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IENvbnRleHRNZW51TW9kdWxlIH0gZnJvbSBcIi4uL21lbnVzL21vZHVsZXMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5tb2R1bGVcIjtcbmltcG9ydCB7IFRyZWVWaWV3RGlzYWJsZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvdHJlZS12aWV3LWRpc2FibGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jZGsvZHJhZy1kcm9wXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFRyZWVWaWV3Q29tcG9uZW50LFxuICAgICAgICBUcmVlVmlld05vZGVDb21wb25lbnQsXG4gICAgICAgIFRyZWVWaWV3Q2hlY2thYmxlRGlyZWN0aXZlLFxuICAgICAgICBUcmVlVmlld05vZGVUZXh0VGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIFRyZWVWaWV3RXhwYW5kYWJsZURpcmVjdGl2ZSxcbiAgICAgICAgVHJlZVZpZXdTZWxlY3RhYmxlRGlyZWN0aXZlLFxuICAgICAgICBUcmVlVmlld0Rpc2FibGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvbnRBd2Vzb21lTW9kdWxlLCBDaGVja0JveE1vZHVsZSwgRm9ybXNNb2R1bGUsIENvbnRleHRNZW51TW9kdWxlLCBEcmFnRHJvcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBUcmVlVmlld0NvbXBvbmVudCxcbiAgICAgICAgVHJlZVZpZXdDaGVja2FibGVEaXJlY3RpdmUsXG4gICAgICAgIFRyZWVWaWV3Tm9kZVRleHRUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgVHJlZVZpZXdFeHBhbmRhYmxlRGlyZWN0aXZlLFxuICAgICAgICBUcmVlVmlld1NlbGVjdGFibGVEaXJlY3RpdmUsXG4gICAgICAgIFRyZWVWaWV3RGlzYWJsZURpcmVjdGl2ZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVHJlZVZpZXdNb2R1bGUge31cbiJdfQ==