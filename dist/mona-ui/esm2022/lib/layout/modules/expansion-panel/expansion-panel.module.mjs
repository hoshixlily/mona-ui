import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpansionPanelComponent } from "./components/expansion-panel/expansion-panel.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ExpansionPanelTitleTemplateDirective } from "./directives/expansion-panel-title-template.directive";
import { ExpansionPanelActionsTemplateDirective } from "./directives/expansion-panel-actions-template.directive";
import * as i0 from "@angular/core";
export class ExpansionPanelModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, declarations: [ExpansionPanelComponent,
            ExpansionPanelTitleTemplateDirective,
            ExpansionPanelActionsTemplateDirective], imports: [CommonModule, FontAwesomeModule], exports: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective, ExpansionPanelActionsTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, imports: [CommonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ExpansionPanelComponent,
                        ExpansionPanelTitleTemplateDirective,
                        ExpansionPanelActionsTemplateDirective
                    ],
                    imports: [CommonModule, FontAwesomeModule],
                    exports: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective, ExpansionPanelActionsTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9sYXlvdXQvbW9kdWxlcy9leHBhbnNpb24tcGFuZWwvZXhwYW5zaW9uLXBhbmVsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUM3RyxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSx5REFBeUQsQ0FBQzs7QUFXakgsTUFBTSxPQUFPLG9CQUFvQjs4R0FBcEIsb0JBQW9COytHQUFwQixvQkFBb0IsaUJBUHpCLHVCQUF1QjtZQUN2QixvQ0FBb0M7WUFDcEMsc0NBQXNDLGFBRWhDLFlBQVksRUFBRSxpQkFBaUIsYUFDL0IsdUJBQXVCLEVBQUUsb0NBQW9DLEVBQUUsc0NBQXNDOytHQUV0RyxvQkFBb0IsWUFIbkIsWUFBWSxFQUFFLGlCQUFpQjs7MkZBR2hDLG9CQUFvQjtrQkFUaEMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsdUJBQXVCO3dCQUN2QixvQ0FBb0M7d0JBQ3BDLHNDQUFzQztxQkFDekM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDO29CQUMxQyxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxvQ0FBb0MsRUFBRSxzQ0FBc0MsQ0FBQztpQkFDbkgiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBFeHBhbnNpb25QYW5lbENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvZXhwYW5zaW9uLXBhbmVsL2V4cGFuc2lvbi1wYW5lbC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBFeHBhbnNpb25QYW5lbFRpdGxlVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL2V4cGFuc2lvbi1wYW5lbC10aXRsZS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IEV4cGFuc2lvblBhbmVsQWN0aW9uc1RlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9leHBhbnNpb24tcGFuZWwtYWN0aW9ucy10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgRXhwYW5zaW9uUGFuZWxDb21wb25lbnQsXG4gICAgICAgIEV4cGFuc2lvblBhbmVsVGl0bGVUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgRXhwYW5zaW9uUGFuZWxBY3Rpb25zVGVtcGxhdGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvbnRBd2Vzb21lTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRXhwYW5zaW9uUGFuZWxDb21wb25lbnQsIEV4cGFuc2lvblBhbmVsVGl0bGVUZW1wbGF0ZURpcmVjdGl2ZSwgRXhwYW5zaW9uUGFuZWxBY3Rpb25zVGVtcGxhdGVEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIEV4cGFuc2lvblBhbmVsTW9kdWxlIHt9XG4iXX0=